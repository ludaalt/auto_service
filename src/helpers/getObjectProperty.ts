export const getObjectProperty = (obj, prop) => {
  if (obj[prop.toLowerCase()]) return obj[prop.toLowerCase()];

  return prop.split('.').reduce((acc, item) => {
    acc = acc[item];
    return acc;
  }, obj);
};

//   const obj = {
//     a: {
//       b: {
//         c: 3,
//       },
//     },
//   };

//   const path = "a.b.c";

//   console.log(getObjectProperty(obj, path));
