import { useEffect, useState } from 'react';
import { Item, fetchItems } from '~/api';

const PLACEHOLDER_IMAGE = import.meta.env.VITE_FRONTEND_URL + '/logo192.png';

interface Prop {
  reload: boolean;
  onLoadCompleted: () => void;
}

export const ItemList = ({ reload, onLoadCompleted }: Prop) => {
  const [items, setItems] = useState<Item[]>([]);
  const [sortKey, setSortKey] = useState<'name' | 'category'>('name'); // ソートの基準
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc'); // ソートの順序
  useEffect(() => {
    const fetchData = () => {
      fetchItems()
        .then((data) => {
          console.debug('GET success:', data);
          setItems(data.items);
          onLoadCompleted();
        })
        .catch((error) => {
          console.error('GET error:', error);
        });
    };

    if (reload) {
      fetchData();
    }
  }, [reload, onLoadCompleted]);

  // ソート関数
  const sortedItems = [...items].sort((a, b) => {
    const valueA = a[sortKey].toLowerCase();
    const valueB = b[sortKey].toLowerCase();

    if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
    if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div>
      <div className="sort-controls">
        <label>Sort by:</label>
        <select value={sortKey} onChange={(e) => setSortKey(e.target.value as 'name' | 'category')}>
          <option value="name">Name</option>
          <option value="category">Category</option>
        </select> 
        <button id="sort-button" onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
            {sortOrder === 'asc' ? '▲ Ascending' : '▼ Descending'}
        </button>
      </div>
      <div className = "ItemList">
        {sortedItems.map((item) => {
          // console.log(item)
          const name = item.image_name
          const url = (import.meta.env.VITE_BACKEND_URL ||'http://localhost:9000')+'/image/'+name
          console.log(item.id)
          return (
            <div key={item.id} className="Item">
                <img src = {url} onError={(e) => (e.currentTarget.src = PLACEHOLDER_IMAGE)}/>
              {/* <img src={PLACEHOLDER_IMAGE} /> */}
              <br/>
              <p className="itemname">Name: {item.name}</p>
              {/* <br /> */}
              <p className="itemcategory">Category: {item.category}</p>
            </div>
          );
        })}
      </div>
    </div>
  );

  // return (
  //   <div id = "table">
  //     <table>
  //       <thead>
  //         <tr>
  //           <th>Image</th>
  //           <th>Name</th>
  //           <th>Category</th>
  //         </tr>
  //       </thead>
  //       <tbody>
  //         {items.map((item) => {
  //           const name = item.image_name;
  //           const url = 'http://localhost:9000/image/' + name;
  //           return (
  //             <tr key={item.id}>
  //               <td>
  //                 <img
  //                   src={url}
  //                   alt={item.name}
  //                   onError={(e) => (e.currentTarget.src = PLACEHOLDER_IMAGE)}
  //                   style={{ width: '100px', height: '100px' }}
  //                 />
  //               </td>
  //               <td>{item.name}</td>
  //               <td>{item.category}</td>
  //             </tr>
  //           );
  //         })}
  //       </tbody>
  //     </table>
  //   </div>
  // );
};
