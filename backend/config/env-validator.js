/**
 * Environment Configuration Validator
 * Ensures all required environment variables are set
 */

function validateEnv() {
  const requiredEnvVars = [
    'DB_URL',
    'PORT',
    'BASE_URL',
    'FRONT_URL',
    'JWT_ACCESS_TOKEN_SECRET',
    'JWT_REFRESH_TOKEN_SECRET',
    'EMAIL',
    'PASSWORD',
    'CLOUDINARY_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET',
    'HASH_SECRET',
  ];

  const missingEnvVars = requiredEnvVars.filter(
    (envVar) => !process.env[envVar]
  );

  if (missingEnvVars.length > 0) {
    console.error(
      '❌ Missing required environment variables:',
      missingEnvVars
    );
    console.error(
      '\n📋 Please ensure all variables are set in your .env file'
    );
    console.error(
      '📖 Refer to .env.example for the complete list of required variables\n'
    );
    process.exit(1);
  }

  // Validate JWT secrets length
  if (process.env.JWT_ACCESS_TOKEN_SECRET.length < 32) {
    console.warn(
      '⚠️  JWT_ACCESS_TOKEN_SECRET should be at least 32 characters long'
    );
  }

  if (process.env.JWT_REFRESH_TOKEN_SECRET.length < 32) {
    console.warn(
      '⚠️  JWT_REFRESH_TOKEN_SECRET should be at least 32 characters long'
    );
  }

  if (process.env.HASH_SECRET.length < 32) {
    console.warn(
      '⚠️  HASH_SECRET should be at least 32 characters long'
    );
  }

  console.log('✅ All required environment variables are set');
}

module.exports = validateEnv;
