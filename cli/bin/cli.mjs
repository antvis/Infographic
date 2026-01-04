#!/usr/bin/env node

// Entry point for the CLI
// This will load the compiled ESM version
const { main } = await import('../lib/cli.js');
main();
