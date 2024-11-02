import { useEffect, useState } from 'react';

import { FaList } from 'react-icons/fa';
import { BsFillGridFill } from 'react-icons/bs';

import Header from '@/layouts/Header';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Select, { IOption } from '@/components/Select';
import PageController from '@/components/PageController';
import { IProduct } from '@/types/Product';

import styles from './styles.module.scss';
import Product from '@/components/Product';
import getAxiosErrorResponse from '@/utils/getAxiosErrorResponse';
import { toast } from 'react-toastify';
import { FormattedError } from '@/utils/HandleError';
import { toastStyle } from '@/styles/toastify';
import useAuth from '@/hooks/useAuth';
import api from '@/services/api';

export default function Home() {

  const { authToken } = useAuth();

  const orderBySelectOptions: IOption[] = [
    { id: 'name', value: 'Nome' },
    { id: 'created_at', value: 'Data de cadastro' }
  ];
  const limitProductsPerPage = 50;

  const [productsLayout, setProductsLayout] = useState<'grid' | 'table'>('grid');
  const [searchProductName, setSearchProductName] = useState('');
  const [selectedOrderBy, setSelectedOrderBy] = useState(orderBySelectOptions[0].id);
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  async function getProducts() {
    if(isLoadingProducts) return;

    try {

      setIsLoadingProducts(true);

      const { data } = await api.get(`/product/list`, {
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

  useEffect(() => {
    getProducts();
  }, [currentPage]);

  return (
    <div id={styles.Container}>
      <Header />
      <div className={styles.Main}>
        <span className={styles.Title}>Produtos</span>
        <div className={styles.InLine} style={{ justifyContent: 'space-between' }}>
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
          <div className={styles.InLine}>
            <Button onClick={() => setProductsLayout('table')} style={{ backgroundColor: productsLayout==='table'?'#4C92EE':'#D9D9D9' }}>
              <FaList size={18} color={productsLayout==='table'?'#FFFFFF':'#AFAFAF'} />
            </Button>
            <Button onClick={() => setProductsLayout('grid')} style={{ backgroundColor: productsLayout==='grid'?'#4C92EE':'#D9D9D9' }}>
              <BsFillGridFill size={18} color={productsLayout==='grid'?'#FFFFFF':'#AFAFAF'} />
            </Button>
          </div>
        </div>
        <div className={styles.InLine} style={{ justifyContent: 'space-between' }}>
          <div className={styles.InLine} style={{ width: '100%' }}>
            <span>Ordenar por:</span>
            <Select
              options={orderBySelectOptions}
              defaultSelected={selectedOrderBy}
              onChange={value => setSelectedOrderBy(value.id)}
              optionsSide='left'
            />
          </div>
          <PageController
            page={currentPage}
            changePage={setCurrentPage}
            nextButtonIsVisible={products.length===limitProductsPerPage}
          />
        </div>
        
        <div style={{ height: '20px' }} />
      
        {products.length>0 ? (
          productsLayout==='grid' ? (
            <div className={styles.ProductsGrid}>
              {products.map(product => (
                <Product key={product.id} product={product} updateProductList={getProducts} />
              ))}
            </div>
          )
          : (
            <div>
              table
            </div>
          )
        ) : <span className={styles.NoProductFound}>Nenhum produto encontrado</span>}
      </div>
    </div>
  );
}