from collections import deque

def build_adjacency_graph(connections):
    """
    Builds an undirected adjacency list from database connection rows.
    Campus pathways are walkable in both directions.
    """
    graph = {}
    for conn in connections:
        u = conn['from_location']
        v = conn['to_location']
        dist = float(conn['distance'])
        time = float(conn['estimated_time'])
        desc = conn['path_description'] or "Walk toward destination."

        if u not in graph:
            graph[u] = []
        if v not in graph:
            graph[v] = []

        graph[u].append({'node': v, 'distance': dist, 'time': time, 'desc': desc})
        graph[v].append({'node': u, 'distance': dist, 'time': time, 'desc': desc})

    return graph

def calculate_shortest_path(start_id, target_id, locations_dict, connections, algorithm='BFS'):
    """
    ADSA Component:
    Executes BFS (Breadth-First Search) or DFS (Depth-First Search) on the campus graph.
    BFS is the primary algorithm for unweighted shortest hop pathfinding.
    """
    if start_id not in locations_dict or target_id not in locations_dict:
        return None

    if start_id == target_id:
        loc = locations_dict[start_id]
        return {
            'from': loc,
            'to': loc,
            'path': [loc],
            'total_distance': 0,
            'estimated_time': 0,
            'algorithm': algorithm,
            'steps': [f"You are currently at {loc['name']}."]
        }

    graph = build_adjacency_graph(connections)
    if start_id not in graph or target_id not in graph:
        return None

    path_ids = []

    if algorithm.upper() == 'DFS':
        # Depth-First Search
        visited = set()
        parent_map = {}

        def dfs(node):
            visited.add(node)
            if node == target_id:
                return True
            for edge in graph.get(node, []):
                neighbor = edge['node']
                if neighbor not in visited:
                    parent_map[neighbor] = node
                    if dfs(neighbor):
                        return True
            return False

        found = dfs(start_id)
        if not found:
            return None

        curr = target_id
        while curr is not None:
            path_ids.insert(0, curr)
            curr = parent_map.get(curr)

    else:
        # Default & Primary: Breadth-First Search (BFS)
        queue = deque([start_id])
        visited = {start_id}
        parent_map = {}
        found = False

        while queue:
            current_node = queue.popleft()
            if current_node == target_id:
                found = True
                break

            for edge in graph.get(current_node, []):
                neighbor = edge['node']
                if neighbor not in visited:
                    visited.add(neighbor)
                    parent_map[neighbor] = current_node
                    queue.append(neighbor)

        if not found:
            return None

        curr = target_id
        while curr is not None:
            path_ids.insert(0, curr)
            curr = parent_map.get(curr)

    path_locations = [locations_dict[pid] for pid in path_ids]

    steps = [f"Start from {locations_dict[start_id]['name']} ({locations_dict[start_id]['building']})."]
    total_dist = 0.0
    total_time = 0.0

    for i in range(len(path_locations) - 1):
        from_loc = path_locations[i]
        to_loc = path_locations[i + 1]

        edge_info = next((e for e in graph.get(from_loc['id'], []) if e['node'] == to_loc['id']), None)
        dist = edge_info['distance'] if edge_info else 80.0
        time = edge_info['time'] if edge_info else 1.2
        total_dist += dist
        total_time += time
        desc = edge_info['desc'] if edge_info else f"Proceed along pathway toward {to_loc['name']}."

        steps.append(f"Walk toward {to_loc['name']} (~{int(dist)}m): {desc}")

    steps.append(f"Arrived at destination: {locations_dict[target_id]['name']} ({locations_dict[target_id]['building']}, {locations_dict[target_id]['floor']}).")

    return {
        'from': locations_dict[start_id],
        'to': locations_dict[target_id],
        'path': path_locations,
        'total_distance': int(total_dist),
        'estimated_time': max(1, round(total_time)),
        'algorithm': algorithm,
        'steps': steps
    }
