import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import axios from 'axios'
import CardCategory from '../../components/CardCategory/CardCategory';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import Loading from '../../components/Loading/Loading'

class Category extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            error: null,
            categories: []
        }

        if (process.env.NODE_ENV === 'development') {
            this.baseURL = `http://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}`
        } else {
            this.baseURL = `${process.env.REACT_APP_HOST}`
        }
    }

    async componentDidMount() {
        await axios.get(`${this.baseURL}/posts`)
            .then(resp => resp.data)
            .then(data => {
                this.setState({ loading: false })
                this.setState({ posts: data })
            })
            .catch(err => {
                this.setState({ error: true })
                console.log(err)
            })

        await axios.get(`${this.baseURL}/categories`)
            .then(resp => resp.data)
            .then(data => {
                this.setState({ loading: false })
                this.setState({ categories: data })
            })
            .catch(err => {
                this.setState({ error: true })
                console.log(err)
            })
    }

    getLastCategoryPost(id) {
        try {
            let orderByDate = { ...this.state.posts }
            // Object.entries retorna um vetor com as posições enumeráveis, ["1"] contém o objeto de fato
            orderByDate = Object.entries(orderByDate)

            orderByDate.sort((a, b) => a["1"].createdAt > b["1"].createdAt ? a : b)
            let orderByDateAndCategory = orderByDate.filter((post) => post["1"].category === id ? true : false)

            orderByDateAndCategory = orderByDateAndCategory.slice(0, 1)
            // orderByDateAndCategory[0] pois o filter retorna um array, ["1"] causado pelo object.entries
            return orderByDateAndCategory[0]["1"]
        } catch (err) {
            this.setState({ error: true })
            console.log(err)
        }
    }

    renderCategories() {
        return (

            this.state.categories.map((category) => {
                return (
                    <div className="col-sm-12 col-md-6 col-lg-4">
                        <CardCategory
                            link={`/category${category.path}`}
                            urlImg={`${this.getLastCategoryPost(category._id).image}`}
                            title={category.title}
                            description={category.description}
                        />
                    </div>
                )

            })

        )
    }

    render() {
        return (
            this.state.error ? <Redirect to='/error' /> :
                this.state.loading ? <Loading /> :
                    <React.Fragment>
                        <Navbar categories={this.state.categories} />
                        <div className="container-full">
                            <div className="container">
                                <div className="row justify-content-center">
                                    {this.renderCategories()}
                                </div>
                            </div>
                            <Footer />
                        </div>
                    </React.Fragment>
        )
    }
}


export default Category