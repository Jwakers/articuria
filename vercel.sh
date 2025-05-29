#!/bin/bash
 
if [[ $VERCEL_ENV == "production"  ]] ; then 
  pnpm build:prod
else 
  pnpm build:dev
fi