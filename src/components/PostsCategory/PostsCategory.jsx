import React, { Component } from 'react'
import './PostsCategory.css'

import { Redirect } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../Navbar/Navbar'
import CardPost from '../CardPost/CardPost'

class PostsCategory extends React.PureComponent {

    constructor(props) {
        super(props)

        this.state = {
            url: window.location,
            error: null,
            redirect: false,
            category: {},
            posts: [],
            categories: []
        }

        if (process.env.NODE_ENV === 'development') {
            this.baseURL = `http://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}`
        } else {
            this.baseURL = `${process.env.REACT_APP_HOST}`
        }
    }

    componentDidMount() {
        axios.get(`${this.baseURL}/categories`)
            .then(resp => resp.data)
            .then(data => {
                this.setState({ categories: data })
                this.setCategory()
            })
            .catch(err => {
                this.setState({ error: true })
                console.log(err)
            })

        axios.get(`${this.baseURL}/posts`)
            .then(resp => resp.data)
            .then(data => {
                this.setState({ posts: data })
            })
            .catch(err => {
                this.setState({ error: true })
                console.log(err)
            })
    }

    setCategory() {
        let categoryLocationPath = document.location.pathname.split('/category')[1]
        let category = this.state.categories.filter((category) => {
            return category.path === categoryLocationPath ? true : false
        })
        category = category[0]
        this.setState({ category })
    }

    getCategoryPosts(id) {
        try {
            let orderByDate = { ...this.state.posts }
            // Object.entries retorna um vetor com as posições enumeráveis, ["1"] contém o objeto de fato
            orderByDate = Object.entries(orderByDate)

            orderByDate.sort((a, b) => a["1"].createdAt > b["1"].createdAt ? a : b)
            let orderByDateAndCategory = orderByDate.filter((post) => post["1"].category === id ? true : false)

            return orderByDateAndCategory.slice(0, -1)
        } catch (err) {
            this.setState({ error: true })
            console.log(err)
        }
    }

    renderPosts() {
        try {
            return this.getCategoryPosts(this.state.category._id).map((post) => {
                post = post["1"]
                return <div key={post._id} className="col-sm-12 col-md-6 col-lg-4">
                    <CardPost
                        title={post.title}
                        date={new Date(post.createdAt).toLocaleDateString()}
                        urlImg={`${this.baseURL}/uploads/${post.image}`}
                        link={`/post/${post._id}`}
                    />
                </div>
            })
        } catch (err) {
            this.setState({ error: true })
            console.log(err)
        }
    }

    render() {
        if (window.location != this.state.url) {
            return <Redirect to={`${window.location}`} />
        }
        return (
            this.state.error === true ? <h1>Ocorreu um erro, recarregue a página!</h1> :
                <div className="container-full">
                    <Navbar categories={this.state.categories && this.state.categories} />
                    <div className="container mt-2">
                        <div className="row justify-content-center">
                            <h1 className="ml-3 mb-2" style={{ color: "#f1b934" }}>Notícias sobre {this.state.category.title}</h1>
                        </div>
                        <div className="row justify-content-center">
                            {this.state.posts && this.renderPosts()}
                        </div>
                    </div>
                </div>
        )
    }
}

export default PostsCategory