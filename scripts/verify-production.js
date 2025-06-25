#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 FineAI Production Readiness Check\n');

// Check if .env.local exists
const envLocalPath = path.join(process.cwd(), '.env.local');
const envExamplePath = path.join(process.cwd(), '.env.example');

console.log('1. Checking environment files...');
if (!fs.existsSync(envLocalPath)) {
  console.log('❌ .env.local not found');
  if (fs.existsSync(envExamplePath)) {
    console.log('💡 Tip: Copy .env.example to .env.local and fill in your values');
  }
  process.exit(1);
} else {
  console.log('✅ .env.local found');
}

// Load environment variables
require('dotenv').config({ path: envLocalPath });

// Check required environment variables
console.log('\n2. Checking required environment variables...');
const requiredVars = [
  'NEXT_PUBLIC_COHERE_API_KEY',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
];

let allVarsPresent = true;
requiredVars.forEach(varName => {
  if (process.env[varName]) {
    console.log(`✅ ${varName} is set`);
  } else {
    console.log(`❌ ${varName} is missing`);
    allVarsPresent = false;
  }
});

// Check file structure
console.log('\n3. Checking file structure...');
const requiredFiles = [
  'package.json',
  'next.config.js',
  'tailwind.config.ts',
  'src/app/layout.tsx',
  'src/app/page.tsx',
  'src/services/cohere.ts',
];

requiredFiles.forEach(filePath => {
  if (fs.existsSync(path.join(process.cwd(), filePath))) {
    console.log(`✅ ${filePath} exists`);
  } else {
    console.log(`❌ ${filePath} missing`);
    allVarsPresent = false;
  }
});

// Check dependencies
console.log('\n4. Checking critical dependencies...');
const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'));
const criticalDeps = [
  'next',
  'react',
  'cohere-ai',
  '@supabase/auth-helpers-nextjs',
  'tailwindcss',
];

criticalDeps.forEach(dep => {
  if (packageJson.dependencies[dep] || packageJson.devDependencies[dep]) {
    console.log(`✅ ${dep} installed`);
  } else {
    console.log(`❌ ${dep} missing`);
    allVarsPresent = false;
  }
});

// Final result
console.log('\n' + '='.repeat(50));
if (allVarsPresent) {
  console.log('🎉 Production readiness check PASSED!');
  console.log('\nNext steps:');
  console.log('1. Run: npm run build:prod');
  console.log('2. Test locally: npm start');
  console.log('3. Deploy to your platform of choice');
  console.log('4. Check health endpoint: /api/health');
  process.exit(0);
} else {
  console.log('❌ Production readiness check FAILED!');
  console.log('\nPlease fix the issues above before deploying.');
  process.exit(1);
} 