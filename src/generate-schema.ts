import { mkdirSync, writeFileSync } from 'fs';
import { printSchema } from 'graphql';
import path from 'path';
import { schema } from './schema';

// Ensure _docs directory exists
const docsDir = path.join(process.cwd(), '_docs');
try {
  mkdirSync(docsDir, { recursive: true });
} catch (e) {
  console.error(e);
}

// Generate SDL schema
const sdl = printSchema(schema);

// Save to _docs/schema.graphql
const schemaPath = path.join(docsDir, 'schema.graphql');
writeFileSync(schemaPath, sdl);

console.log('✅ GraphQL schema generated and saved to _docs/schema.graphql');
console.log(`📄 Schema contains ${sdl.split('\n').length} lines`);

