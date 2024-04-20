import axios from "axios";
import type { Entities } from "../../types";

export const OwnerService = {
  async getOwners() {
    try {
      const response = await axios.get("http://localhost:8080/get_owners");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar os dados do proprietário:", error);
      throw error;
    }
  },

  async createOwner(newOwnerData: Entities.Owner) {
    try {
      const response = await axios.post("http://localhost:8080/create_owner", {
        is_active: true,
        people_type: newOwnerData.people_type,
        bucket_id: newOwnerData.bucket_id,
        person: {
          first_name: newOwnerData.person.first_name,
          last_name: newOwnerData.person.last_name,
          email: newOwnerData.person.email,
          phone: newOwnerData.person.phone,
          cell_phone: newOwnerData.person.cell_phone,
        },
        address: {
          public_place: newOwnerData.address.public_place,
          complement: newOwnerData.address.complement,
          neighborhood: newOwnerData.address.neighborhood,
          city: newOwnerData.address.city,
          state: newOwnerData.address.state,
          zip_code: newOwnerData.address.zip_code,
        },
      });
      if (response.status === 201 && response.data) {
        return true;
      }
    } catch (error) {
      console.error("Erro ao criar um novo proprietário:", error);
      throw error;
    }
  },

  async updateOwner(updateOwnerData: Entities.Owner) {
    try {
      
      const response = await axios.put("http://localhost:8080/update_owner", {
        id: updateOwnerData.id,
        people_type: updateOwnerData.people_type,
        bucket_id: updateOwnerData.bucket_id,
        person: {
          personable_id: updateOwnerData.id,
          first_name: updateOwnerData.person.first_name,
          last_name: updateOwnerData.person.last_name,
          email: updateOwnerData.person.email,
          phone: updateOwnerData.person.phone,
          cell_phone: updateOwnerData.person.cell_phone,
        },
        address: {
          addressable_id: updateOwnerData.id,
          public_place: updateOwnerData.address.public_place,
          complement: updateOwnerData.address.complement,
          neighborhood: updateOwnerData.address.neighborhood,
          city: updateOwnerData.address.city,
          state: updateOwnerData.address.state,
          zip_code: updateOwnerData.address.zip_code,
        },
      });
      if (response.status === 200 && response.data) {
        return true;
      }
    } catch (error) {
      console.error("Erro ao atualizar um proprietário:", error);
      throw error;
    }
  },

  async deleteOwner(deleteOwnerData: Entities.Owner) {
    try {
      const response = await axios.delete(
        `http://localhost:8080/delete_owner/${deleteOwnerData}`,
      );
      if (response.status === 200) {
        return true;
      }
    } catch (error) {
      console.error("Erro ao deletar um proprietário:", error);
      throw error;
    }
  },
};
