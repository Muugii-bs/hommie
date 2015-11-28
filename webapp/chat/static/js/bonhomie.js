var total=1;
var UserBox = React.createClass({
  render: function() {
  	total++;
  	var side = (total%2==1) ? 'left': 'right';
  	var sideDiv = 'col-xs-6 pull-' + side; 
  	var sideMessage = 'talkbubble ' + side;
  	var userID = total;
    return (
      React.createElement('div', {className: sideDiv,},
        React.createElement('div', {className: "col-xs-6"},
        	<img class="img-responsive" src="static/img/dad.png" style={{width: 100}}/>
      	),
      	React.createElement('div', {className: "message col-xs-6"},
        	React.createElement('p', {className: sideMessage}, "Hello, I'm dad")
      	)
      )
    );
  }
});

ReactDOM.render(
  <UserBox />,
  document.getElementById('content')
);