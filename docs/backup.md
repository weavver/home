# Backup

Home uses gremlin to connect with a compatible graph database and is tested against Janusgraph. Commands on this page use gremlin command line which is included with [janusgraph-*.zip][1].

#### Backup data to GraphML file

~~~~
// Using Gremlin run:
% wget https://github.com/JanusGraph/janusgraph/releases/download/v0.5.0/janusgraph-0.5.0.zip
% unzip janusgraph*.zip
% cd janusgraph
% chmod +x bin/gremlin.sh
% bin/gremlin.sh

gremlin> g = traversal().withRemote('conf/remote-graph.properties')
gremlin> graph.io(graphml()).writeGraph('weavver-home-backup.graphml')
~~~~

#### Loading Data

~~~
% wget https://github.com/JanusGraph/janusgraph/releases/download/v0.5.0/janusgraph-0.5.0.zip
% unzip janusgraph*.zip
% cd janusgraph*
% chmod +x bin/gremlin.sh
% bin/gremlin.sh
% gremlin> graph.io(IoCore.graphml()).readGraph('weavver-home-backup.graphml')
~~~

[1]: https://github.com/JanusGraph/janusgraph/releases