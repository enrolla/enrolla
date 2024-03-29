import tracer from 'dd-trace';
import axios from 'axios';

const isProd = process.env.NODE_ENV === 'production';

if (isProd) {
  tracer.init({
    profiling: true,
    env: 'staging', //todo: get from env or inject in build file
    service: 'enrolla-server',
  }); // initialized in a different file to avoid hoisting.
}

// @see: https://docs.datadoghq.com/containers/amazon_ecs/apm/?tab=ec2metadataendpoint&code-lang=nodejs#code
(async () => {
  if (!isProd) {
    return;
  }

  const { data: token } = await axios.put(
    'http://169.254.169.254/latest/api/token',
    undefined,
    { headers: { 'X-aws-ec2-metadata-token-ttl-seconds': '21600' } }
  );
  const { data: hostname } = await axios.get(
    'http://169.254.169.254/latest/meta-data/local-ipv4',
    { headers: { 'X-aws-ec2-metadata-token': token } }
  );
  const url = `http://${hostname}:8126`;
  tracer.setUrl(url);
})();

export default tracer;
