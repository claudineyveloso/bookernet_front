"use client";
import type { Entities } from "@/types";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputMask } from "primereact/inputmask";
import { InputText } from "primereact/inputtext";
import { TabPanel, TabView } from "primereact/tabview";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { classNames } from "primereact/utils";
import React, { useEffect, useRef, useState } from "react";

import { BucketService } from "../../data/service/BucketService";
import { OwnerService } from "../../data/service/OwnerService";

export interface OwnerPhone {
  phone: null | string;
}

export interface OwnerCellPhone {
  cell_phone: null | string;
}

interface Owner {
  id: string;
}

const Owner = () => {
  const emptyOwner: Entities.Owner = {
    people_type: "",
    is_active: true,
    bucket_id: "",
    person: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      cell_phone: "",
    },
    address: {
      public_place: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
      zip_code: "",
    },
  };

  const [owners, setOwners] = useState<Entities.Owner[]>([]);
  const [ownerDialog, setOwnerDialog] = useState(false);
  const [deleteOwnersDialog, setDeleteOwnersDialog] = useState(false);
  const [selectedOwners, setSelectedOwners] = useState(null);
  const [selectedBucket, setSelectedBucket] = useState(null);
  const [deleteOwnerDialog, setDeleteOwnerDialog] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [owner, setOwner] = useState<Entities.Owner>(emptyOwner);
  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<Entities.Owner>>(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const [buckets, setBuckets] = useState<Entities.Bucket[]>([]);
  const [contactPhone, setContactPhone] = useState<OwnerPhone>({ phone: null });
  const [contactCellPhone, setContactCellPhone] = useState<OwnerCellPhone>({
    cell_phone: null,
  });
  const [selectedPeopleType, setSelectedPeopleType] = useState<{
    name: string;
    code: string;
  } | null>(null);

  const peopleTypes = [
    { name: "Física", code: "F" },
    { name: "Jurídica", code: "J" },
  ];

  useEffect(() => {
    OwnerService.getOwners().then((data) => {
      if (data !== null) {
        setOwners(data);
      }
    });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await BucketService.getBuckets();
        setBuckets(data);
      } catch (error) {
        console.error("Erro ao obter buckets:", error);
      }
    };
    fetchData();
  }, []);

  const bucketOptions = buckets.map((bucket) => ({
    label: bucket.name,
    value: bucket.id,
  }));

  const leftToolbarTemplate = () => {
    return (
      <React.Fragment>
        <div className="my-2">
          <Button
            label="Novo"
            icon="pi pi-plus"
            severity="success"
            className=" mr-2"
            onClick={openNew}
          />
          <Button
            label="Deletar"
            icon="pi pi-trash"
            severity="danger"
            onClick={confirmDeleteSelected}
            disabled={!selectedOwners || selectedOwners === 0}
          />
        </div>
      </React.Fragment>
    );
  };

  const actionBodyTemplate = (rowData: Entities.Bucket) => {
    return (
      <>
        <Button
          icon="pi pi-pencil"
          rounded
          severity="success"
          className="mr-2"
          onClick={() => editOwner(rowData)}
        />
        <Button
          icon="pi pi-trash"
          rounded
          severity="warning"
          onClick={() => confirmDeleteOwner(rowData)}
        />
      </>
    );
  };

  const header = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
      <h5 className="m-0">Gerenciar Proprietários</h5>
      <span className="block mt-2 md:mt-0 p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          onInput={(e) => setGlobalFilter(e.currentTarget.value)}
          placeholder="Encontrar um proprietário..."
        />
      </span>
    </div>
  );

  const hideDialog = () => {
    setSubmitted(false);
    setOwnerDialog(false);
  };

  const hideDeleteOwnerDialog = () => {
    setDeleteOwnerDialog(false);
  };

  const hideDeleteOwnersDialog = () => {
    setDeleteOwnersDialog(false);
  };

  const saveOwner = async () => {
    if (selectedPeopleType?.code && selectedBucket) {
      const updatedOwner = { ...owner };
      updatedOwner.people_type = selectedPeopleType.code;
      updatedOwner.bucket_id = selectedBucket;
      updatedOwner.person.phone = contactPhone.phone;
      updatedOwner.person.cell_phone = contactCellPhone.cell_phone;
      setOwner(updatedOwner);
    }
    setSubmitted(true);
    if (owner.people_type.trim() &&
      owner.bucket_id.trim() &&
      owner.person.first_name.trim() &&
      owner.person.last_name.trim() &&
      owner.person.email.trim() &&
      owner.person.cell_phone.trim()
    ) {
      const _owners = owners ? [...owners] : [];
      const _owner = { ...owner };
      if (owner.id) {
        const success = await OwnerService.updateOwner(_owner);
        if (success) {
          const index = findIndexById(owner.id);
          _owners[index] = _owner;
          toast.current?.show({
            severity: "success",
            summary: "Bem-sucedido",
            detail: "Proprietário atualizado com sucesso",
            life: 3000,
          });
        } else {
          toast.current?.show({
            severity: "error",
            summary: "Erro",
            detail: "Falha ao atualizar um proprietário",
            life: 3000,
          });
        }
      } else {
        const success = await OwnerService.createOwner(_owner);
        if (success) {
          _owner.id = createId();
          _owners.push(_owner);
          toast.current?.show({
            severity: "success",
            summary: "Bem-sucedido",
            detail: "Proprietário criado com sucesso",
            life: 3000,
          });
        } else {
          toast.current?.show({
            severity: "error",
            summary: "Erro",
            detail: "Falha ao criar um proprietário",
            life: 3000,
          });
        }
      }

      setOwners(_owners);
      setOwnerDialog(false);
      setOwner(emptyOwner);
    }
  };

  const editOwner = (owner: Entities.Owner) => {
    setOwner({ ...owner });
    setOwnerDialog(true);
    setSelectedPeopleType(
      owner.people_type === "F"
        ? { name: "Física", code: "F" }
        : { name: "Jurídica", code: "J" },
    );
    setSelectedBucket(owner.bucket_id);
    setContactPhone({ phone: owner.person.phone });
    setContactCellPhone({ cell_phone: owner.person.cell_phone });
  };

  const confirmDeleteOwner = (owner: Entities.Owner) => {
    setOwner(owner);
    setDeleteOwnerDialog(true);
  };

  const deleteOwner = async () => {
    const _selected = owners?.filter(
      (val: Owner) => val.id === owner.id
    );

    const _owners = owners?.filter(
      (val: Owner) => val.id !== owner.id
    );

    const success = await OwnerService.deleteOwner(_selected[0].id);
    if (success) {
      setOwners(_owners);
      setDeleteOwnersDialog(false);
      setOwner(emptyOwner);
      toast.current?.show({
        severity: "success",
        summary: "Successful",
        detail: "Proprietário excluído",
        life: 3000,
      });
    } else {
      toast.current?.show({
        severity: "error",
        summary: "Erro",
        detail: "Falha ao deletar um proprietário",
        life: 3000,
      });
    }
  };

  const deleteSelectedOwners = () => {
    const _owners = (owners ?? []).filter((val) => val && val.id === owner.id);
    setOwners(_owners);
    setDeleteOwnersDialog(false);
    setSelectedOwners(null);
    toast.current?.show({
      severity: "success",
      summary: "Successful",
      detail: "Proprietário excluído",
      life: 3000,
    });
  };

  const findIndexById = (id: string) => {
    let index = -1;
    for (let i = 0; i < (owners)?.length; i++) {
      if ((owners)[i].id === id) {
        index = i;
        break;
      }
    }
    return index;
  };

  const createId = () => {
    let id = "";
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  };

  const peopleTypeBodyTemplate = (rowData: Entities.Owner) => {
    return (
      <>
        <span className="p-column-title">PeopleType</span>
        {rowData.people_type === "F" ? "Física" : "Jurídica"}
      </>
    );
  };

  const firstNameBodyTemplate = (rowData: Entities.Owner) => {
    return (
      <>
        <span className="p-column-title">first_name</span>
        `${rowData.person.first_name} ${rowData.person.last_name}`
      </>
    );
  };

  const emailBodyTemplate = (rowData: Entities.Owner) => {
    return (
      <>
        <span className="p-column-title">email</span>
        {rowData.person.email}
      </>
    );
  };

  const cellPhoneBodyTemplate = (rowData: Entities.Owner) => {
    return (
      <>
        <span className="p-column-title">cell_phone</span>
        {rowData.person.cell_phone}
      </>
    );
  };

  const publicPlaceBodyTemplate = (rowData: Entities.Owner) => {
    return (
      <>
        <span className="p-column-title">public_place</span>
        {rowData.address.public_place}
        {rowData.address.complement === ""
          ? ""
          : ` - ${rowData.address.complement}`}
        {rowData.address.neighborhood === ""
          ? ""
          : `, ${rowData.address.neighborhood}`}
      </>
    );
  };

  const ownerDialogFooter = (
    <>
      <Button label="Cancelar" icon="pi pi-times" text onClick={hideDialog} />
      <Button label="Salvar" icon="pi pi-check" text onClick={saveOwner} />
    </>
  );

  const confirmDeleteSelected = () => {
    setDeleteOwnersDialog(true);
  };

  const openNew = () => {
    setOwner(emptyOwner);
    setContactPhone((emptyContactPhone) => ({
      ...emptyContactPhone,
      phone: null,
    }));
    setContactCellPhone((emptyContactCellPhone) => ({
      ...emptyContactCellPhone,
      cell_phone: null,
    }));
    setSelectedPeopleType(null);
    setSelectedBucket(null);
    setSubmitted(false);
    setOwnerDialog(true);
  };

  const onInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    name: string,
    target: string,
  ) => {
    const val = e.target?.value || "";
    setOwner((prevOwner: Entities.Owner) => ({
      ...prevOwner,
      [target]: {
        ...prevOwner[target],
        [name]: val,
      },
    }));
  };

  const deleteOwnerDialogFooter = (
    <>
      <Button
        label="Não"
        icon="pi pi-times"
        text
        onClick={hideDeleteOwnerDialog}
      />
      <Button label="Sim" icon="pi pi-check" text onClick={deleteOwner} />
    </>
  );

  const deleteOwnersDialogFooter = (
    <>
      <Button
        label="Não"
        icon="pi pi-times"
        text
        onClick={hideDeleteOwnersDialog}
      />
      <Button
        label="Sim"
        icon="pi pi-check"
        text
        onClick={deleteSelectedOwners}
      />
    </>
  );

  return (
    <div className="grid crud-demo">
      <div className="col-12">
        <div className="card">
          <Toast ref={toast} />
          <Toolbar className="mb-4" left={leftToolbarTemplate} />
          <DataTable
            ref={dt}
            value={owners}
            selection={selectedOwners}
            onSelectionChange={(e) => setSelectedOwners(e.value)}
            dataKey="id"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25]}
            className="datatable-responsive"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} buckets"
            globalFilter={globalFilter}
            emptyMessage="Nenhum proprietário encontrado."
            header={header}
            responsiveLayout="scroll"
          >
            <Column selectionMode="multiple" headerStyle={{ width: "4rem" }} />
            {/* <Column field="description" header="Descrição" sortable body={descriptionBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column> */}
            <Column
              field="people_type"
              header="Tipo"
              sortable
              body={peopleTypeBodyTemplate}
              headerStyle={{ minWidth: "3rem" }}
            />
            <Column
              field="first_name"
              header="Nome"
              sortable
              body={firstNameBodyTemplate}
              headerStyle={{ minWidth: "15rem" }}
            />
            <Column
              field="email"
              header="Email"
              sortable
              body={emailBodyTemplate}
              headerStyle={{ minWidth: "15rem" }}
            />
            <Column
              field="cell_phone"
              header="Celular"
              sortable
              body={cellPhoneBodyTemplate}
              headerStyle={{ minWidth: "5rem" }}
            />
            <Column
              field="public_place"
              header="Logradouro"
              sortable
              body={publicPlaceBodyTemplate}
              headerStyle={{ minWidth: "5rem" }}
            />
            <Column
              body={actionBodyTemplate}
              headerStyle={{ minWidth: "10rem" }}
            />
          </DataTable>
          <Dialog
            visible={ownerDialog}
            style={{ width: "800px" }}
            header="Detalhes do Proprietário"
            modal
            className="p-fluid"
            footer={ownerDialogFooter}
            onHide={hideDialog}
          >
            <TabView>
              <TabPanel header="Dados pessoais" leftIcon="pi pi-user mr-2">
                <div className="card">
                  <div className="formgrid grid">
                    <div className="field col">
                      <label htmlFor="people_type">
                        Escolha um tipo de pessoa
                      </label>
                      <Dropdown
                        id="people_type"
                        value={selectedPeopleType}
                        onChange={(e) => setSelectedPeopleType(e.value)}
                        options={peopleTypes}
                        optionLabel="name"
                        placeholder="Selecione..."
                        className={classNames({
                          "p-invalid": submitted && !owner.people_type,
                        })}
                        autoFocus
                      />
                      {submitted && !owner.people_type && (
                        <small className="p-invalid">
                          Tipo de pessoa é obrigatório.
                        </small>
                      )}
                    </div>
                    <div className="field col">
                      <label htmlFor="buckets">Escolha um bucket</label>
                      <Dropdown
                        id="bucket_id"
                        value={selectedBucket}
                        onChange={(e) => setSelectedBucket(e.value)}
                        options={bucketOptions}
                        required
                        placeholder="Selecione..."
                        className={classNames({
                          "p-invalid": submitted && !owner.bucket_id,
                        })}
                      />
                      {submitted && !owner.bucket_id && (
                        <small className="p-invalid">
                          Bucket é obrigatório.
                        </small>
                      )}
                    </div>
                  </div>
                  <div className="formgrid grid">
                    <div className="field col">
                      <label htmlFor="first_name">Nome</label>
                      <InputText
                        id="first_name"
                        value={owner.person.first_name}
                        required
                        onChange={(e) =>
                          onInputChange(e, "first_name", "person")
                        }
                        className={classNames({
                          "p-invalid": submitted && !owner.person.first_name,
                        })}
                      />
                      {submitted && !owner.person.first_name && (
                        <small className="p-invalid">Nome é obrigatório.</small>
                      )}
                    </div>
                    <div className="field col">
                      <label htmlFor="last_name">Sobrenome</label>
                      <InputText
                        id="last_name"
                        value={owner.person.last_name}
                        required
                        onChange={(e) =>
                          onInputChange(e, "last_name", "person")
                        }
                        className={classNames({
                          "p-invalid": submitted && !owner.person.last_name,
                        })}
                      />
                      {submitted && !owner.person.last_name && (
                        <small className="p-invalid">
                          Sobrenome é obrigatório.
                        </small>
                      )}
                    </div>
                  </div>
                  <div className="formgrid grid">
                    <div className="field col">
                      <label htmlFor="email">Email</label>
                      <InputText
                        id="email"
                        value={owner.person.email}
                        required
                        onChange={(e) => onInputChange(e, "email", "person")}
                        className={classNames({
                          "p-invalid": submitted && !owner.person.email,
                        })}
                      />
                      {submitted && !owner.person.email && (
                        <small className="p-invalid">
                          Email é obrigatório.
                        </small>
                      )}
                    </div>
                    <div className="field col">
                      <label htmlFor="phone">Telefone</label>
                      <InputMask
                        id="phone"
                        mask="(99) 9999-9999"
                        value={owner.person.phone}
                        onChange={(e) =>
                          setContactPhone({
                            phone:
                              e.target.value !== undefined &&
                                e.target.value !== ""
                                ? e.target.value
                                : null,
                          })
                        }
                        placeholder="(31) 2121-9999"
                      />
                    </div>
                  </div>
                  <div className="formgrid grid">
                    <div className="field col">
                      <label htmlFor="cell_phone">Celular</label>
                      <InputMask
                        id="cell_phone"
                        mask="(99) 99999-9999"
                        value={owner.person.cell_phone}
                        onChange={(e) =>
                          setContactCellPhone({
                            cell_phone:
                              e.target.value !== undefined &&
                                e.target.value !== ""
                                ? e.target.value
                                : null,
                          })
                        }
                        placeholder="(31) 99999-9999"
                      />
                      {submitted && !owner.person.cell_phone && (
                        <small className="p-invalid">
                          Número do celular é obrigatório.
                        </small>
                      )}
                    </div>
                    <div className="field col" />
                  </div>
                </div>
              </TabPanel>
              <TabPanel header="Endereço" leftIcon="pi pi-home mr-2">
                <div className="formgrid grid">
                  <div className="field col">
                    <label htmlFor="public_place">Logradouro</label>
                    <InputText
                      id="public_place"
                      value={owner.address.public_place}
                      onChange={(e) =>
                        onInputChange(e, "public_place", "address")
                      }
                    />
                  </div>
                  <div className="field col">
                    <label htmlFor="complement">Complemento</label>
                    <InputText
                      id="complement"
                      value={owner.address.complement}
                      onChange={(e) =>
                        onInputChange(e, "complement", "address")
                      }
                    />
                  </div>
                </div>
                <div className="formgrid grid">
                  <div className="field col">
                    <label htmlFor="neighborhood">Bairro</label>
                    <InputText
                      id="neighborhood"
                      value={owner.address.neighborhood}
                      onChange={(e) =>
                        onInputChange(e, "neighborhood", "address")
                      }
                    />
                  </div>
                  <div className="field col">
                    <label htmlFor="city">Cidade</label>
                    <InputText
                      id="city"
                      value={owner.address.city}
                      onChange={(e) => onInputChange(e, "city", "address")}
                    />
                  </div>
                </div>
                <div className="formgrid grid">
                  <div className="field col">
                    <label htmlFor="state">Estado</label>
                    <InputText
                      id="state"
                      value={owner.address.state}
                      onChange={(e) => onInputChange(e, "state", "address")}
                    />
                  </div>
                  <div className="field col">
                    <label htmlFor="zip_code">Cep</label>
                    <InputText
                      id="zip_code"
                      value={owner.address.zip_code}
                      onChange={(e) => onInputChange(e, "zip_code", "address")}
                    />
                  </div>
                </div>
              </TabPanel>
            </TabView>
          </Dialog>
          <Dialog
            visible={deleteOwnerDialog}
            style={{ width: "450px" }}
            header="Confirme"
            modal
            footer={deleteOwnerDialogFooter}
            onHide={hideDeleteOwnerDialog}
          >
            <div className="flex align-items-center justify-content-center">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: "2rem" }}
              />
              {owner && (
                <span>
                  Tem certeza de que deseja excluir{" "}
                  <b>{`${owner.person.first_name} ${owner.person.last_name}`}</b>
                  ?
                </span>
              )}
            </div>
          </Dialog>

          <Dialog
            visible={deleteOwnersDialog}
            style={{ width: "450px" }}
            header="Confirme"
            modal
            footer={deleteOwnersDialogFooter}
            onHide={hideDeleteOwnerDialog}
          >
            <div className="flex align-items-center justify-content-center">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: "2rem" }}
              />
              {owner && (
                <span>
                  Tem certeza de que deseja excluir os buckets selecionados?
                </span>
              )}
            </div>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default Owner;
