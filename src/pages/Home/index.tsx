import { useEffect, useState } from 'react';

import { FiSearch } from 'react-icons/fi';
import { toast } from 'react-toastify';

import Header from '@/layouts/Header';
import Input from '@/components/Input';
import Select, { IOption } from '@/components/Select';
import PageController from '@/components/PageController';
import Product from '@/components/Product';
import Button from '@/components/Button';
import { IProduct } from '@/types/Product';
import getAxiosErrorResponse from '@/utils/getAxiosErrorResponse';
import { FormattedError } from '@/utils/HandleError';
import { toastStyle } from '@/styles/toastify';
import useAuth from '@/hooks/useAuth';
import api from '@/services/api';

import styles from './styles.module.scss';

export default function Home() {

  const { authToken } = useAuth();

  const orderBySelectOptions: IOption[] = [
    { id: 'name', value: 'Nome' },
    { id: 'created_at', value: 'Data de cadastro' }
  ];
  const limitProductsPerPage = 10;

  const [searchProductName, setSearchProductName] = useState('');
  const [selectedOrderBy, setSelectedOrderBy] = useState(orderBySelectOptions[0].id);
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [getProductsSignal, setGetProductsSignal] = useState(false);

  async function getProducts(e?: React.FormEvent<HTMLFormElement>) {
    e?.preventDefault();
    if(isLoadingProducts) return;

    try {

      setIsLoadingProducts(true);

      const { data } = await api.get(encodeURI(`/product/list?name=${searchProductName}&orderBy=${selectedOrderBy}&page=${currentPage}&limit=${limitProductsPerPage}`), {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });

      if(data.products) {
        setProducts(data.products);
      } else {
        toast.error('Não foi possível obter os produtos', toastStyle.error);
      }

      setIsLoadingProducts(false);

    } catch(error) {
      console.error(error);

      const axiosError = getAxiosErrorResponse(error);
      if(axiosError) {
        toast.error(`Erro no servidor: ${axiosError.error_description}`, toastStyle.error);
      } else if(error instanceof FormattedError) {
        toast.error(`Erro: ${error.description}`, toastStyle.error);
      } else {
        toast.error('Não foi possível obter os produtos', toastStyle.error);
      }

      setIsLoadingProducts(false);
    }
  }

  function changePage(newPage: number) {
    setCurrentPage(newPage);
    toggleGetProductsSignal();
  }

  function changeSelectedOrderBy(orderBy: string) {
    setSelectedOrderBy(orderBy);
    toggleGetProductsSignal();
  }

  function toggleGetProductsSignal() {
    setGetProductsSignal(state => !state);
  }

  useEffect(() => {
    getProducts();
  }, [getProductsSignal]);

  return (
    <div id={styles.Container}>
      <Header />
      <div className={styles.Main}>
        <span className={styles.Title}>Produtos</span>
        <form onSubmit={getProducts} className={styles.InLine}>
          <Input
            value={searchProductName}
            onChange={value => setSearchProductName(value.trim())}
            props={{
              placeholder: 'Nome do produto'
            }}
            containerStyle={{
              maxWidth: '500px'
            }}
          />
          <Button type='submit' style={{ backgroundColor: '#57D35B' }}>
            <FiSearch size={18} color='#FFFFFF' />
          </Button>
        </form>
        <div className={styles.InLine} style={{ justifyContent: 'space-between' }}>
          <div className={styles.InLine} style={{ width: '100%' }}>
            <span>Ordenar por:</span>
            <Select
              options={orderBySelectOptions}
              defaultSelected={selectedOrderBy}
              onChange={value => changeSelectedOrderBy(value.id)}
              optionsSide='left'
            />
          </div>
          <PageController
            page={currentPage}
            changePage={changePage}
            nextButtonIsVisible={products.length===limitProductsPerPage}
          />
        </div>
        
        <div style={{ height: '20px' }} />
      
        {products.length>0 ? (
          <div className={styles.ProductsGrid}>
            {products.map(product => (
              <Product key={product.id} product={product} updateProductList={getProducts} />
            ))}
          </div>
        ) : <span className={styles.NoProductFound}>Nenhum produto encontrado</span>}
      </div>
    </div>
  );
}