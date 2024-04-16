declare namespace Entities {
  //BucketService
  type Bucket = {
    id?: string;
    description?: string;
    name?: string;
    aws_access_key_id?: string;
    aws_secret_access_key?: string;
    aws_region?: string;
  };

  type Owner = {
    id?: string;
    people_type: string;
    is_active: boolean;
    bucket_id: string;
    person: Person;
    address: Address;
  };

  type Person = {
    id?: string;
    firt_name: string;
    last_name: string;
    email: string;
    phone: string;
    cell_phone: string;
    personable_id: string;
    personable_type: string;
  };

  type Address = {
    id?: string;
    public_place: string;
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
    zip_code: string;
    addressable_id: string;
    addressable_type: string;
  };

  type User = {
    id?: string;
    email?: string;
    password?: string;
    is_active?: boolean;
    user_type?: string;
  };
}
