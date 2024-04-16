'use client'
import React, { useEffect, useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable'
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';

//import { FileUpload } from 'primereact/fileupload';

import { Entities } from '@/types';
import { classNames } from 'primereact/utils';
import { BucketService } from '../../data/service/BucketService';

const Bucket = () => {

  let emptyBucket: Entities.Bucket = {
    description: '',
    name: '',
    aws_access_key_id: '',
    aws_secret_access_key: '',
    aws_region: ''
  };

  const [buckets, setBuckets] = useState(null);
  const [bucketDialog, setBucketDialog] = useState(false);
  const [deleteBucketsDialog, setDeleteBucketsDialog] = useState(false);
  const [selectedBuckets, setSelectedBuckets] = useState(null);
  const [deleteBucketDialog, setDeleteBucketDialog] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [bucket, setBucket] = useState<Entities.Bucket>(emptyBucket);
  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<any>>(null);
  const [globalFilter, setGlobalFilter] = useState('');

  useEffect(() => {
    BucketService.getBuckets().then((data) => setBuckets(data as any));
  }, [])

  const leftToolbarTemplate = () => {
    return (
      <React.Fragment>
        <div className="my-2">
          <Button label="Novo" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
          <Button label="Deletar" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedBuckets || !(selectedBuckets as any).length} />
        </div>
      </React.Fragment>
    );
  };

  const actionBodyTemplate = (rowData: Entities.Bucket) => {
    return (
      <>
        <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editBucket(rowData)} />
        <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteBucket(rowData)} />
      </>
    );
  };

  const header = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
      <h5 className="m-0">Gerenciar Buckets</h5>
      <span className="block mt-2 md:mt-0 p-input-icon-left">
        <i className="pi pi-search" />
        <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Encontrar um bucket..." />
      </span>
    </div>
  );

  const hideDialog = () => {
    setSubmitted(false);
    setBucketDialog(false);
  };

  const hideDeleteBucketDialog = () => {
    setDeleteBucketDialog(false);
  };

  const hideDeleteBucketsDialog = () => {
    setDeleteBucketsDialog(false);
  };

  const saveBucket = async () => {
    setSubmitted(true);

    if (bucket.name.trim()) {
      let _buckets = [...(buckets as any)];
      let _bucket = { ...bucket };
      if (bucket.id) {
        const success = await BucketService.updateBucket(_bucket)
        if (success) {
          const index = findIndexById(bucket.id);
          _buckets[index] = _bucket;
          toast.current?.show({
            severity: 'success',
            summary: 'Bem-sucedido',
            detail: 'Bucket atualizado com sucesso',
            life: 3000
          });
        } else {
          toast.current?.show({
            severity: 'error',
            summary: 'Erro',
            detail: 'Falha ao atualizar um bucket',
            life: 3000
          });

        }

      } else {
        const success = await BucketService.createBucket(_bucket)
        if (success) {
          _bucket.id = createId();
          _buckets.push(_bucket);
          toast.current?.show({
            severity: 'success',
            summary: 'Bem-sucedido',
            detail: 'Bucket criado com sucesso',
            life: 3000
          });
        } else {
          toast.current?.show({
            severity: 'error',
            summary: 'Erro',
            detail: 'Falha ao criar um bucket',
            life: 3000
          });
        }
      }

      setBuckets(_buckets as any);
      setBucketDialog(false);
      setBucket(emptyBucket);
    }
  };

  const editBucket = (bucket: Entities.Bucket) => {
    setBucket({ ...bucket });
    setBucketDialog(true);
  };

  const confirmDeleteBucket = (bucket: Entities.Bucket) => {
    setBucket(bucket);
    setDeleteBucketDialog(true);
  };

  const deleteBucket = async () => {
    let _selected = (buckets as any)?.filter((val: any) => val.id === bucket.id);
    let _buckets = (buckets as any)?.filter((val: any) => val.id !== bucket.id);
    const success = await BucketService.deleteBucket(_selected[0].id)
    if (success) {
      setBuckets(_buckets);
      setDeleteBucketsDialog(false);
      setBucket(emptyBucket);
      toast.current?.show({
        severity: 'success',
        summary: 'Successful',
        detail: 'Bucket excluído',
        life: 3000
      });
    } else {
      toast.current?.show({
        severity: 'error',
        summary: 'Erro',
        detail: 'Falha ao criar bucket',
        life: 3000
      });
    }
  };

  const deleteSelectedBuckets = () => {
    let _buckets = (buckets as any)?.filter((val: any) => !(selectedBuckets as any)?.includes(val));
    setBuckets(_buckets);
    setDeleteBucketsDialog(false);
    setSelectedBuckets(null);
    toast.current?.show({
      severity: 'success',
      summary: 'Successful',
      detail: 'Bucket excluído',
      life: 3000
    });
  };

  const findIndexById = (id: string) => {
    let index = -1;
    for (let i = 0; i < (buckets as any)?.length; i++) {
      if ((buckets as any)[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const createId = () => {
    let id = '';
    let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  };

  // const idBodyTemplate = (rowData: Entities.Bucket) => {
  //   return (
  //     <>
  //       <span className="p-column-title">ID</span>
  //       {rowData.id}
  //     </>
  //   );
  // };

  // const descriptionBodyTemplate = (rowData: Entities.Bucket) => {
  //   return (
  //     <>
  //       <span className="p-column-title">Descrição</span>
  //       {rowData.description}
  //     </>
  //   );
  // };

  const nameBodyTemplate = (rowData: Entities.Bucket) => {
    return (
      <>
        <span className="p-column-title">Name</span>
        {rowData.name}
      </>
    );
  };

  const awsAccessKeyIdBodyTemplate = (rowData: Entities.Bucket) => {
    return (
      <>
        <span className="p-column-title">Access Key Id</span>
        {rowData.aws_access_key_id}
      </>
    );
  };

  const awsSecretAccessKeyBodyTemplate = (rowData: Entities.Bucket) => {
    return (
      <>
        <span className="p-column-title">Secret Access Key</span>
        {rowData.aws_secret_access_key}
      </>
    );
  };

  const awsRegionBodyTemplate = (rowData: Entities.Bucket) => {
    return (
      <>
        <span className="p-column-title">Region</span>
        {rowData.aws_region}
      </>
    );
  };

  const bucketDialogFooter = (
    <>
      <Button label="Cancelar" icon="pi pi-times" text onClick={hideDialog} />
      <Button label="Salvar" icon="pi pi-check" text onClick={saveBucket} />
    </>
  );

  const confirmDeleteSelected = () => {
    setDeleteBucketsDialog(true);
  };

  const openNew = () => {
    setBucket(emptyBucket);
    setSubmitted(false);
    setBucketDialog(true);
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
    const val = (e.target && e.target.value) || '';
    let _bucket = { ...bucket };
    _bucket[`${name}`] = val;

    setBucket(_bucket);
  };

  const deleteBucketDialogFooter = (
    <>
      <Button label="Não" icon="pi pi-times" text onClick={hideDeleteBucketDialog} />
      <Button label="Sim" icon="pi pi-check" text onClick={deleteBucket} />
    </>
  );

  const deleteBucketsDialogFooter = (
    <>
      <Button label="Não" icon="pi pi-times" text onClick={hideDeleteBucketsDialog} />
      <Button label="Sim" icon="pi pi-check" text onClick={deleteSelectedBuckets} />
    </>
  );

  return (
    <div className="grid crud-demo">
      <div className="col-12">
        <div className="card">
          <Toast ref={toast} />
          <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>
          <DataTable
            ref={dt}
            value={buckets}
            selection={selectedBuckets}
            onSelectionChange={(e) => setSelectedBuckets(e.value as any)}
            dataKey="id"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25]}
            className="datatable-responsive"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} buckets"
            globalFilter={globalFilter}
            emptyMessage="Nenhum bucket encontrado."
            header={header}
            responsiveLayout="scroll"
          >
            <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
            {/* <Column field="description" header="Descrição" sortable body={descriptionBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column> */}
            <Column field="name" header="Nome" sortable body={nameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
            <Column field="aws_access_key_id" header="Ch. de acesso Id" sortable body={awsAccessKeyIdBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
            <Column field="aws_secret_access_key" header="Ch. de acesso secreta" sortable body={awsSecretAccessKeyBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
            <Column field="aws_region" header="Região" sortable body={awsRegionBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
            <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
          </DataTable>
          <Dialog visible={bucketDialog} style={{ width: '600px' }} header="Detalhes do Bucket" modal className="p-fluid" footer={bucketDialogFooter} onHide={hideDialog}>
            <div className="field">
              <label htmlFor="description">Descrição</label>
              <InputTextarea id="description" value={bucket.description} onChange={(e) => onInputChange(e, 'description')} required rows={3} cols={20} />
            </div>

            <div className="field">
              <label htmlFor="name">Nome</label>
              <InputText
                id="name"
                value={bucket.name}
                onChange={(e) => onInputChange(e, 'name')}
                required
                autoFocus
                className={classNames({
                  'p-invalid': submitted && !bucket.name
                })}
              />
              {submitted && !bucket.name && <small className="p-invalid">O nome é obrigatório.</small>}
            </div>
            <div className="field">
              <label htmlFor="aws_access_key_id">Access key id</label>
              <InputText
                id="aws_access_key_id"
                value={bucket.aws_access_key_id}
                onChange={(e) => onInputChange(e, 'aws_access_key_id')}
                required
                autoFocus
                className={classNames({
                  'p-invalid': submitted && !bucket.aws_access_key_id
                })}
              />
              {submitted && !bucket.aws_access_key_id && <small className="p-invalid">O Access key id é obrigatório.</small>}
            </div>

            <div className="field">
              <label htmlFor="aws_secret_access_key">Secret access key</label>
              <InputText
                id="aws_secret_access_key"
                value={bucket.aws_secret_access_key}
                onChange={(e) => onInputChange(e, 'aws_secret_access_key')}
                required
                autoFocus
                className={classNames({
                  'p-invalid': submitted && !bucket.aws_secret_access_key
                })}
              />
              {submitted && !bucket.aws_secret_access_key && <small className="p-invalid">O Secret access key é obrigatório.</small>}
            </div>
            <div className="field">
              <label htmlFor="aws_region">Região</label>
              <InputText
                id="aws_region"
                value={bucket.aws_region}
                onChange={(e) => onInputChange(e, 'aws_region')}
                autoFocus
                className={classNames({
                  'p-invalid': submitted && !bucket.aws_region
                })}

              />
            </div>
          </Dialog>
          <Dialog visible={deleteBucketDialog} style={{ width: '450px' }} header="Confirme" modal footer={deleteBucketDialogFooter} onHide={hideDeleteBucketDialog}>
            <div className="flex align-items-center justify-content-center">
              <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
              {bucket && (
                <span>
                  Tem certeza de que deseja excluir <b>{bucket.name}</b>?
                </span>
              )}
            </div>
          </Dialog>

          <Dialog visible={deleteBucketsDialog} style={{ width: '450px' }} header="Confirme" modal footer={deleteBucketsDialogFooter} onHide={hideDeleteBucketDialog}>
            <div className="flex align-items-center justify-content-center">
              <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
              {bucket && <span>Tem certeza de que deseja excluir os buckets selecionados?</span>}
            </div>
          </Dialog>

        </div>
      </div>
    </div>
  )
}

export default Bucket
