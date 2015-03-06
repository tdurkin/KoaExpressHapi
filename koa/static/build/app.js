var App = React.createClass({displayName: "App",
	componentDidMount: function() {
		var that = this;
		$.get('/items', function(itemList) {
			that.setState({items: itemList});
		});
	},
	getInitialState: function() {
		return {
			potentialValue: '',
			items: [],
			editingItem: -1
		}
	},
	handleChange: function(evt) {
		if (evt.charCode === 13) {
			this.state.items.push(evt.target.value);
			$.post('/items', {name: evt.target.value});
			this.forceUpdate();
			evt.target.value = '';
		}
	},
	deleteItem: function(indexToDelete) {
		$.ajax('/items/' + indexToDelete, {type: 'DELETE'});
		this.state.items.splice(indexToDelete, 1);
		this.forceUpdate();
	},
	makeItemEditable: function(index) {
		this.setState({
			editingItem: index
		});
	},
	updateItem: function(index, newValue) {
		$.ajax('/items/' + index, {type: 'PUT', data: {name: newValue}});

		this.setState({editingItem: -1});
		this.state.items[index] = newValue;
		this.forceUpdate();
	},
	render: function() {
		return (
			React.createElement("div", null, 
				React.createElement(ItemList, {
					data: this.state.items, 
					deleteitem: this.deleteItem, 
					makeitemeditable: this.makeItemEditable, 
					updateitem: this.updateItem, 
					editing: this.state.editingItem}), 

				React.createElement("input", {style: {outline: 0}, type: "text", placeholder: "Add items here", onKeyPress: this.handleChange})
			)
		);
	}
});

var ItemList = React.createClass({displayName: "ItemList",
	render: function() {
		var styles = {
			container: {
				width: 136,
				listStyleType: 'none',
				paddingLeft: 0
			}
		};

		var listItems = [];
		for (var i = 0; i < this.props.data.length; i++) {
			if (i === this.props.editing) {
				listItems.push(
					React.createElement(EditingItem, {
						value: this.props.data[i], 
						updateitem: this.props.updateitem, 
						index: i})
				);
			}
			else {
				listItems.push(
					React.createElement(Item, {
						value: this.props.data[i], 
						index: i, 
						makeitemeditable: this.props.makeitemeditable, 
						deleteitem: this.props.deleteitem})
				);
			}
		}

		return (
			React.createElement("ul", {style: styles.container}, 
				listItems
			)
		);
	}
});

var EditingItem = React.createClass({displayName: "EditingItem",
	handleChange: function(evt) {
		if (evt.charCode === 13) {
			this.props.updateitem(this.props.index, evt.target.value);
		}
	},
	render: function() {
		var styles = {
			container: {
				marginTop: 5
			}
		};

		return (
			React.createElement("li", {style: styles.container}, 
				React.createElement("input", {type: "text", onKeyPress: this.handleChange, defaultValue: this.props.value})
			)
		);
	}
});

var Item = React.createClass({displayName: "Item",
	handleDelete: function() {
		this.props.deleteitem(this.props.index);
	},
	handleEdit: function() {
		this.props.makeitemeditable(this.props.index);
	},
	render: function() {
		var styles = {
			container: {
				marginTop: 5
			},
			deleteIcon: {
				'float': 'right',
				cursor: 'pointer',
				color: 'red',
				fontFamily: 'sans-serif',
				fontWeight: 'bold'
			}
		};

		return (
			React.createElement("li", {style: styles.container}, 
				React.createElement("span", {onClick: this.handleEdit}, this.props.value), 
				React.createElement("span", {style: styles.deleteIcon, onClick: this.handleDelete}, "X")
			)
		);
	}
});

React.render(React.createElement(App, null), document.getElementById('theApp'));