/**
 * API ROUTE: POST /api/auth/login
 * 
 * PROPÓSITO: Autenticar usuario y generar JWT
 * 
 * FLUJO COMPLETO:
 * 1. Cliente envía: { email, password }
 * 2. Servidor busca usuario en BD por email
 * 3. Compara password ingresada con hash en BD
 * 4. Si todo OK → genera JWT y retorna { user, token }
 * 5. Cliente guarda token en localStorage
 * 6. Futuras peticiones usan este token en Authorization header
 * 
 * SEGURIDAD:
 * - No devolvemos la contraseña (nunca)
 * - Comparamos con bcrypt (no es texto plano)
 * - El JWT contiene: userId, email, role (sin datos sensibles)
 * - JWT expira en 7 días (fuerza logout periódico)
 * 
 * PREGUNTAS DE SUSTENTACIÓN:
 * - ¿Por qué .select('+password')? Porque UserSchema excluye password por defecto
 * - ¿Qué pasa si email no existe? Retorna "Invalid email or password" (no específico)
 * - ¿Qué pasa si password es incorrecto? Mismo error (por seguridad)
 */

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/config/db';
import { User } from '@/models';
import { comparePassword, generateToken } from '@/utils/auth';
import { IApiResponse, ILoginResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json<IApiResponse<null>>(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    /**
     * PASO 1: Buscar usuario por email
     * 
     * .select('+password') - Incluye el campo password
     * (normalmente excluido por UserSchema.set('toJSON'))
     * 
     * Necesitamos el hash para comparar con la contraseña ingresada
     */
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return NextResponse.json<IApiResponse<null>>(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    /**
     * PASO 2: Comparar contraseñas
     * 
     * comparePassword(incomingPassword, hashedPassword)
     * Usa bcrypt.compare() internamente
     * 
     * SEGURIDAD: No mostramos si fue email o password incorrecto
     * (previene ataques de enumeración)
     */
    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json<IApiResponse<null>>(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    /**
     * PASO 3: Generar JWT
     * 
     * El token contiene: { userId, email, role }
     * Firmado con JWT_SECRET (solo el servidor la conoce)
     * Expira en 7 días
     * 
     * NUNCA incluimos: password, __v, timestamps
     */
    const userResponse = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    const token = generateToken(userResponse);

    const response: ILoginResponse = {
      user: userResponse,
      token,
    };

    return NextResponse.json<IApiResponse<ILoginResponse>>(
      { success: true, data: response },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json<IApiResponse<null>>(
      { success: false, error: 'An error occurred during login' },
      { status: 500 }
    );
  }
}
