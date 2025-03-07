import { useEffect, useState } from 'react';
import { Item, fetchItems } from '~/api';

const PLACEHOLDER_IMAGE = import.meta.env.VITE_FRONTEND_URL + '/logo192.png';

interface Prop {
  reload: boolean;
  onLoadCompleted: () => void;
}

export const ItemList = ({ reload, onLoadCompleted }: Prop) => {
  const [items, setItems] = useState<Item[]>([]);
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

  return (
    <div className = "ItemList">
      {items.map((item) => {
        // console.log(item)
        const name = item.image_name
        const url = 'http://localhost:9000/image/'+name
        console.log(item.id)
        return (
          <div key={item.id} className="Item">
              <img src = {url} onError={(e) => (e.currentTarget.src = PLACEHOLDER_IMAGE)}/>
            {/* <img src={PLACEHOLDER_IMAGE} /> */}
            <span>Name: {item.name}</span>
            <br />
            <span>Category: {item.category}</span>
          </div>
        );
      })}
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
