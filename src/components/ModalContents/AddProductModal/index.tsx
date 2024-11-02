import { useState } from 'react';

import { toast } from 'react-toastify';

import useAuth from '@/hooks/useAuth';
import useModal from '@/hooks/useModal';
import api from '@/services/api';
import { toastStyle } from '@/styles/toastify';
import getAxiosErrorResponse from '@/utils/getAxiosErrorResponse';
import { FormattedError } from '@/utils/HandleError';

import styles from './styles.module.scss';
import Input from '@/components/Input';
import Button from '@/components/Button';

interface AddProductModalProps {
  onSubmit: () => void;
}

export default function AddProductModal({
  onSubmit
}: AddProductModalProps) {

  const { authToken } = useAuth();
  const { closeModal } = useModal();

  const [imageFile, setImageFile] = useState<File>();
  const [imageData, setImageData] = useState('');
  const [product, setProduct] = useState({
    name: '',
    description: '',
    value: 1
  });
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
      toast.error('Ocorreu ao tentar adicionar a imagem!', toastStyle.error);
    }
  }

  async function handleSubmit() {
    if(isLoading) return;

    if(product.name.trim()==='' ||
      product.description.trim()===''
    ) {
      toast.error('Preencha os campos corretamente!', toastStyle.error);
      return;
    }

    if(product.value<=0) {
      toast.error('O valor mínimo de um produto é R$ 1', toastStyle.error);
      return;
    }

    if(!imageData) {
      toast.error('Adicione um imagem!', toastStyle.error);
      return;
    }

    try {

      setIsLoading(true);

      const { data } = await api.post('/product/create', {
        name: product.name.trim(),
        description: product.description.trim(),
        value: product.value,
        image_base64: imageData
      }, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });

      setIsLoading(false);

      if(data.product) {

        toast.success('Produto criado!', toastStyle.success);

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
      {imageFile ? (
        <div className={styles.ImageContainer}>
          <img className={styles.Image} src={'data:image/png;base64,'+imageData} alt='custom-image' />
        </div>
      ) :null}

      <label htmlFor='input-product-image' className={styles.InputImage}>Adicionar Imagem</label>
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
          value={product.name}
          onChange={value => setProduct(state => ({...state, name: value }))}
        />
      </div>

      <div className={styles.InColumn}>
        <span>Descrição:</span>
        <Input
          value={product.description}
          onChange={value => setProduct(state => ({...state, description: value }))}
        />
      </div>

      <div className={styles.InColumn}>
        <span>Valor:</span>
        <Input
          props={{
            type: 'number',
            min: 1
          }}
          value={product.value}
          onChange={value => setProduct(state => ({...state, value: +value }))}
        />
      </div>

      <Button onClick={handleSubmit} disabled={isLoading} style={{ backgroundColor: '#26a02a' }}>Criar produto</Button>
    </div>
  );
}