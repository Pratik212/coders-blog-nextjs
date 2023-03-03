import React from 'react';
import Tabs from "../../components/Tabs";
import {GetServerSideProps} from "next";
import {fetchArticles, fetchCategories} from "../../http";
import {AxiosResponse} from "axios";
import {IArticle, ICategory, ICollectionResponse, IPagination} from "../../types";
import qs from 'qs';
import ArticleList from "../../components/ArticleList";
import Pagination from "../../components/Pagination";

interface IPropTypes {
    categories : {
        items : ICategory[];
        pagination: IPagination;
    },
    articles : {
        items : IArticle[];
        pagination: IPagination;
    },
    slug: string
}


const Category = ({categories, articles, slug}: IPropTypes) => {
    const  {page, pageCount} = articles.pagination;
    return (
    <>
        <Tabs categories={categories.items}/>
        <ArticleList articles={articles.items}/>
        <Pagination page={page} pageCount={pageCount}/>
    </>
    );
};


export const getServerSideProps: GetServerSideProps = async ({query}) =>{
    const options = {
        populate: ['author.avatar'],
        sort: ['id:desc'],
        filters: {
            category: {
                slug: query.category
            }
        }
    }

    const queryString = qs.stringify(options)

    const {data: articles} : AxiosResponse<ICollectionResponse<IArticle[]>> = await fetchArticles(queryString)

    const {data: categories} : AxiosResponse<ICollectionResponse<ICategory[]>> = await fetchCategories();

    return {
        props: {
            categories : {
                items : categories.data,
                pagination: articles.meta.pagination
            },
            articles:{
                items: articles.data,
                pagination: articles.meta.pagination
            },
            slug: query.category
        }
    }

}

export default Category;