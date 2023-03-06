import React from 'react';
import Tabs from "../../components/Tabs";
import {GetServerSideProps} from "next";
import {fetchArticles, fetchCategories} from "../../http";
import {AxiosResponse} from "axios";
import {debounce, IArticle, ICategory, ICollectionResponse, IPagination, IQueryOptions} from "../../types";
import qs from 'qs';
import ArticleList from "../../components/ArticleList";
import Pagination from "../../components/Pagination";
import {router} from "next/client";
import {useRouter} from "next/router";

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
    const router = useRouter();
    const { category: categorySlug} = router.query;
    const  {page, pageCount} = articles.pagination;

    const handleSearch = (query: string) => {
        router.push(`/category/${categorySlug}?search=${query}`);
    }

    return (
    <>
        <Tabs categories={categories.items} handleOnSearch={debounce(handleSearch, 500)}/>
        <ArticleList articles={articles.items}/>
        <Pagination page={page} pageCount={pageCount}  redirectUrl={`/category/${categorySlug}`}/>
    </>
    );
};


export const getServerSideProps: GetServerSideProps = async ({query}) =>{
    const options : Partial<IQueryOptions>= {
        populate: ['author.avatar'],
        sort: ['id:desc'],
        filters: {
            category: {
                slug: query.category
            }
        },
        pagination: {
            page: query.page ? +query.page : 1,
            pageSize: 1
        },
    }

    if (query.search) {
        options.filters = {
            Title: {
                $containsi: query.search,
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