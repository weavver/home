# Import/Export Data

Home uses gremlin to connect with a compatible graph database and is tested with Janusgraph. Commands on this page use gremlin command line which is included with [janusgraph-*.zip][1].

#### Get Gremlin
~~~~
% wget https://github.com/JanusGraph/janusgraph/releases/download/v0.5.0/janusgraph-0.5.0.zip
% unzip janusgraph*.zip
~~~~

#### Start Gremlin
~~~~
% cd janusgraph
% chmod +x bin/gremlin.sh
% bin/gremlin.sh
~~~~

#### Connect to a local server
gremlin> g = traversal().withRemote('conf/remote-graph.properties')

Note: To connect to a server on another machine modify conf/reemote-objects.yaml and change "hosts: [localhost]" to reflect your server IP such as "hosts: [10.0.0.50]"

#### Export a GraphML file

~~~~
gremlin> graph.io(graphml()).writeGraph('weavver-home-backup.graphml')
~~~~

#### Import a GraphML file

~~~
gremlin> graph.io(IoCore.graphml()).readGraph('weavver-home-backup.graphml')
~~~

[1]: https://github.com/JanusGraph/janusgraph/releases