import Head from 'next/head'
import {GetServerSideProps, NextPage} from "next";
import {fetchArticles, fetchCategories} from "../http";
import {AxiosResponse} from "axios";
import {IArticle, ICategory, ICollectionResponse, IPagination} from "../types";
import Tabs from "../components/Tabs";
import ArticleList from "../components/ArticleList";
import qs from 'qs';
import Pagination from "../components/Pagination";
import {capitalizeFirstLetter, makeCategory} from "../utils";

interface IPropTypes {
    categories : {
        items : ICategory[]
    },
    articles:{
        items: IArticle [];
        pagination: IPagination
    },
    slug: string
}


const Home: NextPage<IPropTypes> = ({categories, articles, slug}) =>{

    const  {page, pageCount} = articles.pagination;

    const formattedCategory = () =>{
        return  capitalizeFirstLetter(makeCategory(slug));
    }
    return(
        <div>
            <Head>
                <title>Coder's Blog {formattedCategory()}</title>
                <meta name="description" content="Generated by create next app"/>
            </Head>
            <Tabs categories={categories.items}/>
            <ArticleList articles={articles.items}/>
            <Pagination page={page} pageCount={pageCount}/>
        </div>
    )
}


export const getServerSideProps: GetServerSideProps =  async ({query}) =>{

    //fetch articles
    const options = {
        populate : ['author.avatar'],
        sort: ['id:desc'],
        pagination: {
            page: query.page ? query.page : 1,
            pageSize: 1
        }
    }

    const queryString = qs.stringify(options)
    const {data: articles} : AxiosResponse<ICollectionResponse<IArticle[]>> = await fetchArticles(queryString)

    // fetch categories
    const {data: categories} : AxiosResponse<ICollectionResponse<ICategory[]>> = await fetchCategories();

    return {
        props: {
            categories : {
                items : categories.data
            },
            articles: {
                items: articles.data,
                pagination: articles.meta.pagination
            },
            slug: query.category || null
        }
    }
}

export default Home
