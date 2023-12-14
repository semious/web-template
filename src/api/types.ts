export interface SDModelInfoResp {
  models: SDModel[];
  options: SDOptions;
}

export interface SDModel {
  config: string,
  filename: string,
  hash: string,
  model_name: string,
  sha256: string,
  title: string,
}

export interface SDOptions {
  sd_checkpoint_hash: string;
  sd_vae:string;
  CLIP_stop_at_last_layers: number;
  [key: string]: any;
}
