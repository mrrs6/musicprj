import React from 'react';
import ReactDOM from 'react-dom';

import './google-fonts/roboto700.css';
import './bootstrap/css/bootstrap.min.css';
import './font-awesome/css/font-awesome.min.css';
import './style.css';

import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'

const API = 'http://208.113.133.216:8000/api/';

class AddUserModal extends React.Component {
	constructor(props) {
    super(props);
    this.state = {
			name: '',
			email:''
		};

    this.handleChange = this.handleChange.bind(this);
  }

	handleChange(event) {
		switch(event.target.id) {
			case "input_user_name":
				this.setState({name:event.target.value});
				break;
			case "input_user_email":
				this.setState({email: event.target.value});
				break;
			default:
				;
		}
  }

	render() {
		return (
			<div className="modal fade" id="addUser" tabIndex="-1" role="dialog">
				<div className="modal-dialog modal-lg" role="document">
					<div className="modal-content">
						<div className="modal-header">
							<button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
							<h4 className="modal-title">Add user</h4>
						</div>
						<div className="modal-body">
							<form>
								<div className="form-group">
									<label>Name</label>
									<input type="text" className="form-control" id="input_user_name" placeholder="Name" onChange={this.handleChange} />
								</div>
								<div className="form-group">
									<label>Email</label>
									<input type="email" className="form-control" id="input_user_email" placeholder="Email" onChange={this.handleChange} />
								</div>
							</form>
						</div>
						<div className="modal-footer">
							<button type="button" className="btn btn-default" data-dismiss="modal">Cancel</button>
							<button type="button" className="btn btn-primary" data-dismiss="modal" onClick={() => this.props.instance.AddUser(this.props.instance, this.state.name,this.state.email)}>Save</button>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

class AddTrackModal extends React.Component {
	constructor(props) {
    super(props);
    this.state = {
			title: '',
			artist: '',
			album:''
		};

    this.handleChange = this.handleChange.bind(this);
  }

	handleChange(event) {
		switch(event.target.id) {
			case "input_track_title":
				this.setState({title:event.target.value});
				break;
			case "input_track_artist":
				this.setState({artist: event.target.value});
				break;
			case "input_track_album":
				this.setState({album: event.target.value});
				break;
			default:
				;
		}
  }

	render() {
		return (
			<div className="modal fade" id="addTrack" tabIndex="-1" role="dialog">
				<div className="modal-dialog modal-lg" role="document">
					<div className="modal-content">
						<div className="modal-header">
							<button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
							<h4 className="modal-title">Add user</h4>
						</div>
						<div className="modal-body">
							<form>
								<div className="form-group">
									<label>Title</label>
									<input type="text" className="form-control" id="input_track_title" placeholder="Title" onChange={this.handleChange} />
								</div>
								<div className="form-group">
									<label>Artist</label>
									<input type="text" className="form-control" id="input_track_artist" placeholder="Artist" onChange={this.handleChange} />
								</div>
								<div className="form-group">
									<label>Album</label>
									<input type="text" className="form-control" id="input_track_album" placeholder="Album" onChange={this.handleChange} />
								</div>
							</form>
						</div>
						<div className="modal-footer">
							<button type="button" className="btn btn-default" data-dismiss="modal">Cancel</button>
							<button type="button" className="btn btn-primary" data-dismiss="modal" onClick={() => this.props.instance.AddTrack(this.props.instance, this.state.title,this.state.artist, this.state.album)}>Save</button>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

class Modal extends React.Component {
	render() {
		return (
			<div className="modal fade" id={this.props.id} tabIndex="-1" role="dialog">
				<div className="modal-dialog modal-lg" role="document">
					<div className="modal-content">
						<div className="modal-header">
							<button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
							<h4 className="modal-title">{this.props.title}</h4>
						</div>
						<div className="modal-body">
							CONTENT HERE!
						</div>
						<div className="modal-footer">
							<button type="button" className="btn btn-default" data-dismiss="modal">Cancel</button>
							<button type="button" className="btn btn-primary" data-dismiss="modal" onClick={() => this.submitfcn()}>Save</button>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

class NavPill extends React.Component {
	render() {
		this.active = this.props.active==="true" ? "active" : "";
		return(
			<li className={this.active}><a data-toggle="pill" href={this.props.href}>{this.props.title}</a></li>
		)
	}
}

function CustomConfirm(t, ok_callback, params) {
	return(
		confirmAlert({
      title: 'Confirmation',                        	
      message: 'Are you sure you want to do this?',      
      confirmLabel: 'Confirm',                           
      cancelLabel: 'Cancel',                             	
      onConfirm: () => ok_callback(t, params),    	
    })
	)
}

function renderUsersTable(tabledata, t) {
	return (
		<table className="table table-hover text-center">
			<thead>
				<th className="text-center">Name</th><th className="text-center">E-mail</th><th></th>
			</thead>
			<tbody>
				{
					tabledata.map(
						row =>
							<tr>
								<td>{row.name}</td>
								<td>{row.email}</td>
								<td><button className='btn btn-info' data-toggle='modal' data-target='#seeFavourite' title='Favorites'><i className='fa fa-star'></i></button>&nbsp;<button className='btn btn-danger' title='Delete' onClick={() => t.DeleteUser(row.email)}><i className='fa fa-trash'></i></button></td>
							</tr>
					)
				}
			</tbody>
		</table>
	)
}

function renderTracksTable(tabledata, t) {
	return (
		<table className="table table-hover text-center">
			<thead>
				<th className="text-center">Title</th><th className="text-center">Artist</th><th className="text-center">Album</th><th></th>
			</thead>
			<tbody>
				{
					tabledata.map(
						row =>
							<tr><td> {row.title}</td><td>{row.artist}</td><td>{row.album}</td><td><button className='btn btn-danger' title='Delete' onClick={() => t.DeleteTrack(row.track_id_external)}><i className='fa fa-trash'></i></button></td></tr>
					)
				}
			</tbody>
		</table>
	)
}


class TabPane extends React.Component {
	render() {
		this.cn="contents tab-pane";
		if(this.props.active==="true") this.cn = this.cn + " active";
		this.ia="fa " + this.props.fa_icon_add;
		return (
			<div className={this.cn} id={this.props.id}>
				<div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
					<h4 className="text-center title">{this.props.title}</h4>
				</div>
				<div className="text-right addButton">
					<button className="btn btn-primary" data-toggle="modal" data-target={this.props.modal}><i className={this.ia}></i>&nbsp;+</button>
				</div>
					{this.props.content}
			</div>
		)
	}
}



class MusicPrj extends React.Component {
  constructor(props) {
    super(props);
 		this.state = {
  		users: [],
  		tracks: [],
		};
	}

	componentWillMount() {
		//Append now bootstrap js, before the final render.
		window.jQuery = window.$ = require('jquery');
		const script1 = document.createElement("script");
    script1.src = "http://localhost/ubi1/runtime/plugins/bootstrap/js/bootstrap.min.js";
    script1.type = "text/javascript";
    document.body.appendChild(script1);
		const script2 = document.createElement("script");
    script2.src = "http://localhost/ubi1/runtime/globals.js";
    script2.type = "text/javascript";
    document.body.appendChild(script2);
	}

	LoadUsers() {
		fetch(API + 'users/')
			.then(response=>response.json())
			.then(data => this.setState({users: data}));
	}

	LoadTracks() {
		fetch(API + 'tracks/')
			.then(response=>response.json())
			.then(data => this.setState({tracks: data}));
	}

	componentDidMount() {
		this.LoadUsers();
		this.LoadTracks();
	}

	AddUser(t, name, email) {
		fetch(API+'users/', { method: 'PUT', body: JSON.stringify({"name":name,"email":email}) })
			.then(response => response.json())
			.then(data => function(t1, data1){
				if(typeof(data1.type)!=="undefined") {
					alert(data1.message);
				} else {
					t1.LoadUsers();
				}
			}(t, data))
	}

	AddTrack(t, title, artist, album) {
		fetch(API+'tracks/', { method: 'PUT', body: JSON.stringify({"title":title,"artist":artist,"album":album}) })
			.then(response => response.json())
			.then(data => function(t1, data1){
				if(typeof(data1.type)!=="undefined") {
					alert(data1.message);
				} else {
					t1.LoadTracks();
				}
			}(t, data))
	}

	DeleteUser(email) {
		CustomConfirm(this, function(t, params){  
			fetch(API+'users/', { method: 'DELETE', body: JSON.stringify(params) })
				.then(response => response.json())
				.then(data => t.setState({users: data}))
		}, {"email":email});
	}

	DeleteTrack(track_id_external) {
		CustomConfirm(this, function(t, params){  
			fetch(API+'tracks/', { method: 'DELETE', body: JSON.stringify(params) })
				.then(response => response.json())
				.then(data => t.setState({tracks: data}))
		}, {"track_id_external":track_id_external});
	}

	render() {
		return (
			<div>
				<div className="container">
					<ul className="nav nav-pills text-center">
						<NavPill active="true" href="#users" title="Users" />
						<NavPill active="false" href="#tracks" title="Tracks" />
					</ul>
					<br />

					<div className="tab-content">
						<TabPane active="true" id="users" fa_icon_add="fa-user" title="List of users" modal="#addUser" content={renderUsersTable(this.state.users, this)} />
						<TabPane active="false" id="tracks" fa_icon_add="fa-music" title="List of tracks" modal="#addTrack" content={renderTracksTable(this.state.tracks, this)} />
					</div>

				</div>

				<AddUserModal instance={this} />
				<AddTrackModal instance={this} />
				<Modal id="seeFavourite" title="Favorites" />
			</div>
		)
	}
}


// ========================================

ReactDOM.render(
  <MusicPrj />,
  document.getElementById('root')
);

