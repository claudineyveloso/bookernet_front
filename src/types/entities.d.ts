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

  type User = {
    id?: string;
    email?: string;
    password?: string;
    is_active?: boolean;
    user_type?: string;
  };
}
