/**
 * NEXT.JS CONFIGURATION
 * 
 * Este archivo configura comportamientos especiales de Next.js.
 * 
 * EXPERIMENTAL: serverComponentsExternalPackages
 * 
 * PROBLEMA:
 * - Mongoose y Nodemailer son librerías pensadas para Node.js
 * - Next.js intenta "bundlear" (empaquetar) TODO para el navegador
 * - Pero estas librerías solo funcionan en el servidor
 * 
 * SOLUCIÓN:
 * - Decirle a Next.js: "Estas librerías NO las empaques, úsalas como están"
 * - Así Mongoose + Nodemailer funcionan en API routes sin problemas
 * 
 * CASOS DE USO:
 * 1. Mongoose: Conectar a MongoDB desde /api/... routes
 * 2. Nodemailer: Enviar emails desde el servidor
 * 
 * SIN ESTO:
 * - Error: "Cannot find module 'mongoose'" en navegador
 * - La app se rompe
 * 
 * PREGUNTAS DE SUSTENTACIÓN:
 * - ¿Qué es bundlear? Empaquetar código para enviarlo al navegador
 * - ¿Por qué Mongoose necesita esto? Porque usa APIs de Node.js, no del navegador
 * - ¿Es peligroso? No, solo se usa en el servidor (API routes)
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['mongoose', 'nodemailer'],
  },
}

module.exports = nextConfig
