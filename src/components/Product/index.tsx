import { useState } from 'react';

import { FiTrash } from 'react-icons/fi';
import { toast } from 'react-toastify';

import { IProduct } from '@/types/Product';
import api from '@/services/api';
import Button from '@/components/Button';
import EditProductModal from '@/components/ModalContents/EditProductModal';
import Input from '@/components/Input';
import useModal from '@/hooks/useModal';
import getAxiosErrorResponse from '@/utils/getAxiosErrorResponse';
import { toastStyle } from '@/styles/toastify';
import { FormattedError } from '@/utils/HandleError';
import useAuth from '@/hooks/useAuth';

import styles from './styles.module.scss';

interface ProductProps {
  product: IProduct;
  updateProductList: () => void;
}

export default function Product({
  product,
  updateProductList
}: ProductProps) {

  const { authToken } = useAuth();
  const { openModal } = useModal();

  const [quantityToUpdate, setQuantityToUpdate] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  function handleOpenEditProductModal() {
    openModal({ element: <EditProductModal product={product} onSubmit={updateProductList} /> });
  }

  async function handleRemoveProduct() {
    if(confirm(`Tem certeza que deseja remover o produto: ${product.name}?`)) {
      try {

        const { data } = await api.delete(`/product/delete/${product.id}`, {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        });

        if(data.success) {
          
          toast.success('Produto removido!', toastStyle.success);

          updateProductList();

        }

      } catch(error) {
        console.error(error);
  
        const axiosError = getAxiosErrorResponse(error);
        if(axiosError) {
          toast.error(`Erro no servidor: ${axiosError.error_description}`, toastStyle.error);
        } else if(error instanceof FormattedError) {
          toast.error(`Erro: ${error.description}`, toastStyle.error);
        } else {
          toast.error('Não foi possível remover o produto', toastStyle.error);
        }
      }
    }
  }

  function handleSetIncomingClick(action: 'add' | 'sub') {
    if(action==='add') {
      handleUpdateProductQuantity(product.quantity + quantityToUpdate);
    } else if(action==='sub') {
      if(product.quantity - quantityToUpdate < 0) {
        toast.error('Não é permitido uma quantidade menor que 0', toastStyle.error);
        return;
      }
      handleUpdateProductQuantity(product.quantity - quantityToUpdate);
    }
  }

  async function handleUpdateProductQuantity(newQuantity: number) {
    if(isLoading) return;

    try {

      setIsLoading(true);

      const { data } = await api.patch('/product/update/setIncoming', {
        id: product.id,
        quantity: newQuantity
      }, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });

      if(data.product) {

        setIsLoading(false);

        updateProductList();

      }

    } catch(error) {
      console.error(error);

      const axiosError = getAxiosErrorResponse(error);
      if(axiosError) {
        toast.error(`Erro no servidor: ${axiosError.error_description}`, toastStyle.error);
      } else if(error instanceof FormattedError) {
        toast.error(`Erro: ${error.description}`, toastStyle.error);
      } else {
        toast.error('Não foi possível alterar a quantidade do produto', toastStyle.error);
      }
    }
  }

  return (
    <div id={styles.Container}>
      <div className={styles.RemoveButtonContainer}>
        <Button onClick={handleRemoveProduct} style={{ backgroundColor: '#D35757', padding: '15px', height: 'auto' }}>
          <FiTrash size={15} color='#FFFFFF' />
        </Button>
      </div>
      <div className={styles.EditButtonContainer}>
        <Button onClick={handleOpenEditProductModal} style={{ padding: '10px 15px', height: 'auto', fontSize: '0.8rem' }}>
          Editar
        </Button>
      </div>
      <div className={styles.ImageContainer}>
        <img className={styles.Image} src={api.defaults.baseURL+'/images/'+product.image_name} alt={product.image_name} />
      </div>
      <div className={styles.Content}>
        <span className={styles.Name}>{product.name}</span>
        <div className={styles.InLine} style={{ justifyContent: 'space-between' }}>
          <span className={styles.Price}>R$ {product.value.toFixed(2).split('.').join(',')}</span>
          <span className={styles.Quantity}>{product.quantity} <span className={styles.QuantityUnd}>und</span></span>
        </div>
      </div>
      <div className={styles.InLine} style={{ padding: '5px' }}>
        <Button onClick={() => handleSetIncomingClick('sub')} disabled={isLoading} style={{ backgroundColor: '#D35757' }}>-</Button>
        <Input
          props={{
            type: 'number',
            disabled: isLoading
          }}
          value={quantityToUpdate}
          onChange={value => setQuantityToUpdate(+value)}
          containerStyle={{
            padding: '5px'
          }}
        />
        <Button onClick={() => handleSetIncomingClick('add')} disabled={isLoading} style={{ backgroundColor: '#57D35B' }}>+</Button>
      </div>
    </div>
  );
}