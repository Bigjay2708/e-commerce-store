#!/usr/bin/env node

/**
 * Environment Configuration Validator
 * Run this script to validate your production environment setup
 */

function validateRequiredEnvVars() {
  const requiredVars = [
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL',
  ];
  
  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
  
  // Validate NEXTAUTH_SECRET strength
  if (process.env.NEXTAUTH_SECRET && process.env.NEXTAUTH_SECRET.length < 32) {
    throw new Error('NEXTAUTH_SECRET must be at least 32 characters long');
  }
}

function validateEnvironment() {
  console.log('🔍 Validating environment configuration...\n');
  
  try {
    // Validate required environment variables
    validateRequiredEnvVars();
    console.log('✅ Required environment variables are present');
    
    // Check NEXTAUTH_SECRET strength
    const secret = process.env.NEXTAUTH_SECRET;
    if (secret && secret.length >= 32) {
      console.log('✅ NEXTAUTH_SECRET meets minimum length requirements');
    } else {
      console.warn('⚠️  NEXTAUTH_SECRET should be at least 32 characters');
    }
    
    // Check NEXTAUTH_URL format
    const url = process.env.NEXTAUTH_URL;
    if (url && (url.startsWith('https://') || url.startsWith('http://localhost'))) {
      console.log('✅ NEXTAUTH_URL format is valid');
    } else {
      console.warn('⚠️  NEXTAUTH_URL should start with https:// (or http://localhost for development)');
    }
    
    // Check for production-specific variables
    if (process.env.NODE_ENV === 'production') {
      const productionVars = [
        'DATABASE_URL',
        'STRIPE_SECRET_KEY',
        'EMAIL_FROM',
      ];
      
      const missingProduction = productionVars.filter(varName => !process.env[varName]);
      
      if (missingProduction.length === 0) {
        console.log('✅ Production environment variables are configured');
      } else {
        console.warn(`⚠️  Missing production variables: ${missingProduction.join(', ')}`);
      }
    }
    
    console.log('\n🎉 Environment validation completed successfully!');
    
  } catch (error) {
    console.error('❌ Environment validation failed:');
    console.error(error.message);
    process.exit(1);
  }
}

// Run validation
validateEnvironment();
