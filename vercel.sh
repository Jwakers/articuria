#!/bin/bash
 
if [[ $VERCEL_ENV == "production"  ]] ; then 
  pnpm build:convex
else 
  pnpm build
fi