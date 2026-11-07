import validator from 'validator';

export const validateURL = (url) => {
  if (!url || typeof url !== 'string') {
    return { valid: false, message: 'URL is required.' };
  }

  let formattedUrl = url.trim();

  // Prepend protocol if missing
  if (!/^https?:\/\//i.test(formattedUrl)) {
    formattedUrl = 'http://' + formattedUrl;
  }

  const isValid = validator.isURL(formattedUrl, {
    protocols: ['http', 'https'],
    require_tld: true,
    require_protocol: true,
    require_host: true,
    require_valid_protocol: true,
    allow_underscores: true,
    allow_trailing_dot: false,
    allow_protocol_relative_urls: false
  }) || /^(https?:\/\/)?(\d{1,3}\.){3}\d{1,3}(:\d+)?(\/.*)?$/i.test(formattedUrl);

  if (!isValid) {
    return { valid: false, message: 'Invalid URL format. Please provide a valid domain or IP address.' };
  }

  return { valid: true, url: formattedUrl };
};

