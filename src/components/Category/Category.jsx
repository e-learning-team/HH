import React, { useState } from 'react';
import { apiCategory } from "../../apis/category";

// Define a recursive functional component
function HoverableTree({data}) {
    const loadCategory = async () => {
        const res = await apiCategory({ build_type: 'TREE' });
        if (res && res.data != null) {
            // setData(res.data);
            console.log(res.data)
            return data;
        }
    };
    // const data = loadCategory()
    const [hoveredNode, setHoveredNode] = useState(null);

    const handleMouseEnter = (nodeId) => {
        setHoveredNode(nodeId);
    };

    const handleMouseLeave = () => {
        setHoveredNode(null);
    };
    return (
        <ul>
            {data.map((node) => (
                <li
                    key={node.id}
                    onMouseEnter={() => handleMouseEnter(node.id)}
                    onMouseLeave={handleMouseLeave}
                >
                    {node.title}
                    {hoveredNode === node.id && node.children.length > 0 && (
                        <HoverableTree data={node.children} />
                    )}
                </li>
            ))}
        </ul>
    );
}

export default HoverableTree;

