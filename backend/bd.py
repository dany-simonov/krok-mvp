from flask import Flask, request, jsonify
import sqlite3
import json

app = Flask(__name__)
DATABASE = 'graph_db.sqlite'

def init_db():
    conn = sqlite3.connect(DATABASE)
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS nodes
                 (id TEXT PRIMARY KEY, data TEXT)''')
    c.execute('''CREATE TABLE IF NOT EXISTS edges
                 (id TEXT PRIMARY KEY, 
                  source TEXT, 
                  target TEXT,
                  data TEXT,
                  FOREIGN KEY(source) REFERENCES nodes(id),
                  FOREIGN KEY(target) REFERENCES nodes(id))''')
    conn.commit()
    conn.close()


@app.route('/node', methods=['POST'])
def add_node():
    data = request.json
    try:
        conn = sqlite3.connect(DATABASE)
        c = conn.cursor()
        c.execute("INSERT INTO nodes (id, data) VALUES (?, ?)",
                  (data['id'], json.dumps(data.get('data', {}))))
        conn.commit()
        return jsonify({"status": "success"}), 201
    except sqlite3.IntegrityError:
        return jsonify({"error": "Node ID already exists"}), 400
    finally:
        conn.close()

@app.route('/node/<node_id>', methods=['GET'])
def get_node(node_id):
    conn = sqlite3.connect(DATABASE)
    c = conn.cursor()
    c.execute("SELECT data FROM nodes WHERE id=?", (node_id,))
    row = c.fetchone()
    conn.close()
    if row:
        return jsonify({"id": node_id, "data": json.loads(row[0])})
    return jsonify({"error": "Node not found"}), 404

@app.route('/edge', methods=['POST'])
def add_edge():
    data = request.json
    try:
        conn = sqlite3.connect(DATABASE)
        c = conn.cursor()
        c.execute('''INSERT INTO edges (id, source, target, data)
                     VALUES (?, ?, ?, ?)''',
                  (data['id'], 
                   data['source'], 
                   data['target'],
                   json.dumps(data.get('data', {}))))
        conn.commit()
        return jsonify({"status": "success"}), 201
    except sqlite3.IntegrityError:
        return jsonify({"error": "Edge ID already exists"}), 400
    finally:
        conn.close()

@app.route('/edge/<edge_id>', methods=['GET'])
def get_edge(edge_id):
    conn = sqlite3.connect(DATABASE)
    c = conn.cursor()
    c.execute("SELECT source, target, data FROM edges WHERE id=?", (edge_id,))
    row = c.fetchone()
    conn.close()
    if row:
        return jsonify({
            "id": edge_id,
            "source": row[0],
            "target": row[1],
            "data": json.loads(row[2])
        })
    return jsonify({"error": "Edge not found"}), 404

if __name__ == '__main__':
    init_db()
    app.run(host='0.0.0.0', port=5000, debug=True)