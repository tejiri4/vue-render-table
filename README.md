# vue-hello-world-simple

## Project setup
```
npm install --save vue-render-table
```

## Import
```
import VueTable from "vue-render-table";
```


### Install Globally
```
Vue.use(VueTable)
```

### Use Components Locally
```
import VueTable from "vue-render-table";
```

### Examples
```
  <vue-table 
    :data="
    [
        {
          id: 1,
          name: "Test1",
          age: 22,
        },
        {
          id: 2,
          name: "Test 2",
          age: 22,
        },
        {
          id: 3,
          name: "T",
          age: 22,
        },
      ]
    " 
    :headers="
      [
        {
          title: "Name",
          dataIndex: "name",
        },
        {
          title: "Age",
          dataIndex: "age",
        },
      ]
    " 
    :itemsPerRow="3" 
  />
```

