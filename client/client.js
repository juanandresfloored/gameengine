var React = require('react');
var CommentBox = require('./views/view.jsx'); // need to specify the jsx extension

React.render(
	React.createElement(CommentBox, null),
  document.getElementById('content')
);