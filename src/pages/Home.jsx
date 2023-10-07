import React, { useRef, useEffect, useState, useCallback } from 'react';
import HoverableTree from '../components/Category/Category';

const Home = () => {
  useEffect(() => {
    document.title = 'Trang chủ';
  }, []);
  // const getNode = (data) => {
  //   return (

  //   );
  // };
  const [treeData , setTreeData] = useState()
  const loadTreeData = async () =>{
    if(!treeData){
        
        if(res && res.data != null){
          setTreeData(res.data)
          return treeData;
        }
    }
  }
  // 
  //       console.log(res)
  return (
    <div>
      <HoverableTree />
    </div>
  );
};

export default Home;