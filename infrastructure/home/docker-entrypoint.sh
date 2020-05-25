

echo "Welcome Home"
echo "designed by Weavver, Inc."
echo "Founding Author: Mitchel Constantin"

./wait-for-it.sh $GREMLIN_HOST:$GREMLIN_PORT --timeout=120 --strict -- ts-node app.ts
