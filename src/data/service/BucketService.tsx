import { Demo } from '@/types';
import { Entities } from '../../types'
import axios from 'axios';

export const BucketService = {

  async getBuckets() {
    try {
      const response = await axios.get('http://localhost:8080/get_buckets');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar os dados do bucket:', error);
      throw error;
    }
  },

  async createBucket(newBucketData: Entities.Bucket) {
    try {
      const response = await axios.post(
        "http://localhost:8080/create_bucket", {
        "description": newBucketData.description,
        "name": newBucketData.name,
        "aws_access_key_id": newBucketData.aws_access_key_id,
        "aws_secret_access_key": newBucketData.aws_secret_access_key,
        "aws_region": newBucketData.aws_region,
      });
      if (response.status === 201 && response.data) {
        return true
      }
    }
    catch (error) {
      console.error('Erro ao criar um novo bucket:', error);
      throw error;

    }
  },

  async updateBucket(updateBucketData: Entities.Bucket) {
    try {

      const response = await axios.put(
        "http://localhost:8080/update_bucket", {
        "id": updateBucketData.id,
        "description": updateBucketData.description,
        "name": updateBucketData.name,
        "aws_access_key_id": updateBucketData.aws_access_key_id,
        "aws_secret_access_key": updateBucketData.aws_secret_access_key,
        "aws_region": updateBucketData.aws_region,
      });
      if (response.status === 200 && response.data) {
        return true
      }
    }
    catch (error) {
      console.error('Erro ao atualizar um novo bucket:', error);
      throw error;
    }
  },

  async deleteBucket(deleteBucketData: Entities.Bucket) {
    try {
      const response = await axios.delete(
        `http://localhost:8080/delete_bucket/${deleteBucketData}`
      )
      if (response.status === 200) {
        return true
      }
    } catch (error) {
      console.error('Erro ao deletar um bucket:', error);
      throw error;
    }
  },

  getBucketsSmall() {
    return fetch('/demo/data/buckets-small.json', { headers: { 'Cache-Control': 'no-cache' } })
      .then((res) => res.json())
      .then((d) => d.data as Demo.Bucket[]);
  },

  getBucketsss() {
    return fetch('/demo/data/buckets.json', { headers: { 'Cache-Control': 'no-cache' } })
      .then((res) => res.json())
      .then((d) => d.data as Demo.Bucket[]);
  },

  getBucketsWithOrdersSmall() {
    return fetch('/demo/data/products-orders-small.json', { headers: { 'Cache-Control': 'no-cache' } })
      .then((res) => res.json())
      .then((d) => d.data as Demo.Bucket[]);
  }
};
