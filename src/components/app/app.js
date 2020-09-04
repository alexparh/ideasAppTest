import React, { Component } from "react"
import AppHeader from "../app-header/app-header"
import SearchPanel from "../search-panel/search-panel"
import PostStatusFilter from "../post-status-filter/post-status-filter"
import PostList from "../post-list/post-list"
import PostAddForm from "../post-add-form/post-add-form"

import "./app.css"

export default class App extends Component {
	constructor(props) {
		super(props)
		this.state = {
			data: [
				{
					label: "бизнес с мышеловками",
					important: true,
					like: false,
					id: 1
				},
				{
					label: "бизнес с сыром",
					important: false,
					like: false,
					id: 2
				},
				{
					label: "бизнес с мышами",
					important: false,
					like: false,
					id: 3
				}
			],
			term: "",
			filter: "all"
		}
	}

	maxId = 4

	searchPost(items, term) {
		if (term.length === 0) {
			return items
		}

		return items.filter((item) => {
			return item.label.indexOf(term) > -1
		})
	}

	filterPost(items, filter) {
		if (filter === "like") {
			//Понравилось
			return items.filter((item) => item.like)
		} else {
			//Все
			return items
		}
	}

	onUpdateSearch = (term) => {
		this.setState({ term })
	}

	onFilterSelect = (filter) => {
		this.setState({ filter })
	}

	deleteItem = (id) => {
		this.setState(({ data }) => ({
			data: data.filter((item) => item.id !== id)
		}))
	}

	addItem = (body) => {
		this.setState(({ data }) => {
			const newItem = {
				label: body,
				important: false,
				id: this.maxId++
			}
			const newArr = [...data, newItem]
			return { data: newArr }
		})
	}

	onToggleImportant = (id) => {
		this.onToggleElement(id, "important")
	}

	onToggleLiked = (id) => {
		this.onToggleElement(id, "like")
	}

	onToggleElement = (id, toggleElem) => {
		this.setState(({ data }) => {
			const ind = data.findIndex((elem) => elem.id === id)
			const element = data[ind]
			const updatedElement = {
				...element,
				[toggleElem]: !element[toggleElem]
			}
			const newArr = [
				...data.slice(0, ind),
				updatedElement,
				...data.slice(ind + 1)
			]
			return { data: newArr }
		})
	}

	render() {
		const { data, term, filter } = this.state
		const liked = data.filter((item) => item.like).length
		const allPosts = data.length

		const visiblePosts = this.filterPost(
			this.searchPost(data, term),
			filter
		)

		return (
			<div className="app">
				<AppHeader liked={liked} allPosts={allPosts} />
				<div className="search-panel d-flex">
					<SearchPanel onUpdateSearch={this.onUpdateSearch} />
					<PostStatusFilter
						filter={filter}
						onFilterSelect={this.onFilterSelect}
					/>
				</div>
				<PostList
					posts={visiblePosts}
					onDelete={this.deleteItem}
					onToggleImportant={this.onToggleImportant}
					onToggleLiked={this.onToggleLiked}
				/>
				<PostAddForm onAdd={(body) => this.addItem(body)} />
			</div>
		)
	}
}
