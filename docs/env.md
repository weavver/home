
# Helpful notes

Run this command to load a .env file into your terminal:

export $(egrep -v '^#' .env-aws-dev | xargs)
