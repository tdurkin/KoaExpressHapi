var App = React.createClass({
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
			<div>
				<ItemList 
					data={this.state.items} 
					deleteitem={this.deleteItem}
					makeitemeditable={this.makeItemEditable}
					updateitem={this.updateItem}
					editing={this.state.editingItem} />

				<input style={{outline: 0}} type="text" placeholder="Add items here" onKeyPress={this.handleChange} />
			</div>
		);
	}
});

var ItemList = React.createClass({
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
					<EditingItem 
						value={this.props.data[i]} 
						updateitem={this.props.updateitem}
						index={i} />
				);
			}
			else {
				listItems.push(
					<Item 
						value={this.props.data[i]} 
						index={i}
						makeitemeditable={this.props.makeitemeditable}
						deleteitem={this.props.deleteitem} />
				);
			}
		}

		return (
			<ul style={styles.container}>
				{listItems}
			</ul>
		);
	}
});

var EditingItem = React.createClass({
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
			<li style={styles.container}>
				<input type="text" onKeyPress={this.handleChange} defaultValue={this.props.value} />
			</li>
		);
	}
});

var Item = React.createClass({
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
			<li style={styles.container}>
				<span onClick={this.handleEdit}>{this.props.value}</span>
				<span style={styles.deleteIcon} onClick={this.handleDelete}>X</span>
			</li>
		);
	}
});

React.render(<App />, document.getElementById('theApp'));