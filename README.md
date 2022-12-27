# ANTD Table with Resizable, Drag and Drop and Hidden Columns

Project for using Ant Design Table and make the user capable of customize his table.

## Props

The component Table accepts all the props of any Antd Table plus:

### `withHeader`

Boolean prop that shows the header of the table with the icons to hide columns and save the changes that the user could have made

### `headerComponent`

Can pass your own header for the table. When is provided the Hidde Columns and Save changes are up to you

### `onSavePreferences`

Function that receives as parameter the array of columns with all the changes done by the user when the icons Save is clicked

## Resizable Feature

It uses 'react-resizable' package.
For the columns to be resizable they must have the property "width" with a number.

## Drag and Drop Feature

It uses 'react-drag-listview' package.
If the columns has children only the parent can be moved.
When the Table is expandable the columns can be moved when there is not any expanded row.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
