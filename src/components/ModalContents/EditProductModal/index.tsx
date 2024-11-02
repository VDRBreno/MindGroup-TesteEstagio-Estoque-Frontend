import { IProduct } from '@/types/Product';

import styles from './styles.module.scss';
import { useState } from 'react';
import api from '@/services/api';
import { toast } from 'react-toastify';
import { toastStyle } from '@/styles/toastify';
import Input from '@/components/Input';
import Button from '@/components/Button';
import useAuth from '@/hooks/useAuth';
import getAxiosErrorResponse from '@/utils/getAxiosErrorResponse';
import { FormattedError } from '@/utils/HandleError';
import useModal from '@/hooks/useModal';

interface EditProductModalProps {
  product: IProduct;
  onSubmit: () => void;
}

export default function EditProductModal({
  product,
  onSubmit
}: EditProductModalProps) {

  const { authToken } = useAuth();
  const { closeModal } = useModal();

  const [imageFile, setImageFile] = useState<File>();
  const [imageData, setImageData] = useState('');
  const [productState, setProductState] = useState<IProduct>({ ...product });
  const [isLoading, setIsLoading] = useState(false);

  function handleChangeImageFile(e: React.ChangeEvent<HTMLInputElement>) {
    if(e && e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      const reader = new FileReader();
      reader.onloadend = () => {
        let data = reader.result as string;
        data = data.split('data:image/png;base64,').join('');
        setImageData(data);
      }
      reader.onerror = () => {
        toast.error('Ocorreu um erro ao tentar ler o arquivo!', toastStyle.error);
      }
      reader.readAsDataURL(e.target.files[0]);
    } else {
      toast.error('Ocorreu um erro ao tentar alterar a imagem!', toastStyle.error);
    }
  }

  async function handleSubmit() {
    if(isLoading) return;

    if(productState.name.trim()==='' ||
      productState.description.trim()===''
    ) {
      toast.error('Preencha os campos corretamente!', toastStyle.error);
      return;
    }

    if(productState.value<=0) {
      toast.error('O valor mínimo de um produto é R$ 1', toastStyle.error);
      return;
    }

    try {

      setIsLoading(true);

      const { data } = await api.patch('/product/update', {
        id: productState.id,
        name: productState.name.trim(),
        description: productState.description.trim(),
        value: productState.value,
        image_base64: imageFile?imageData:undefined
      }, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });

      setIsLoading(false);

      if(data.product) {
        
        toast.success('Produto atualizado!', toastStyle.success);

        onSubmit();
        closeModal();

      }

    } catch(error) {
      console.error(error);

      const axiosError = getAxiosErrorResponse(error);
      if(axiosError) {
        toast.error(`Erro no servidor: ${axiosError.error_description}`, toastStyle.error);
      } else if(error instanceof FormattedError) {
        toast.error(`Erro: ${error.description}`, toastStyle.error);
      } else {
        toast.error('Não foi possível atualizar o produto', toastStyle.error);
      }

      setIsLoading(false);
    }
  }

  return (
    <div id={styles.Container}>
      <div className={styles.ImageContainer}>
        {imageFile
          ? <img className={styles.Image} src={'data:image/png;base64,'+imageData} alt='custom-image' />
          : <img className={styles.Image} src={api.defaults.baseURL+'/images/'+product.image_name+`?${new Date().getTime()}`} alt='imagem' />
        }
      </div>

      <label htmlFor='input-product-image' className={styles.InputImage}>Alterar Imagem</label>
      <input
        style={{ display: 'none' }}
        id='input-product-image'
        type='file'
        accept='image/png, image/jpg, image/jpeg'
        multiple={false}
        onChange={handleChangeImageFile}
      />

      <div className={styles.InColumn}>
        <span>Nome:</span>
        <Input
          value={productState.name}
          onChange={value => setProductState(state => ({...state, name: value }))}
        />
      </div>

      <div className={styles.InColumn}>
        <span>Descrição:</span>
        <Input
          value={productState.description}
          onChange={value => setProductState(state => ({...state, description: value }))}
        />
      </div>

      <div className={styles.InColumn}>
        <span>Valor:</span>
        <Input
          props={{
            type: 'number',
            min: 1
          }}
          value={productState.value}
          onChange={value => setProductState(state => ({...state, value: +value }))}
        />
      </div>

      <Button onClick={handleSubmit} disabled={isLoading} style={{ backgroundColor: '#26a02a' }}>Atualizar produto</Button>
    </div>
  );
}