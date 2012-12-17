#ifndef crypto_sign_ed25519_H
#define crypto_sign_ed25519_H

#define crypto_sign_ed25519_SECRETKEYBYTES 64
#define crypto_sign_ed25519_PUBLICKEYBYTES 32
#define crypto_sign_ed25519_BYTES 64


#ifdef __cplusplus

extern std::string crypto_sign_ed25519(const std::string &,const std::string &);
extern std::string crypto_sign_ed25519_open(const std::string &,const std::string &);
extern std::string crypto_sign_ed25519_keypair(std::string *);
extern std::string crypto_sign_ed25519_publickey(const std::string &, std::string *);

extern "C" {
#endif

extern int crypto_sign_ed25519(unsigned char *,unsigned long long *,const unsigned char *,unsigned long long,const unsigned char *);
extern int crypto_sign_ed25519_open(unsigned char *,unsigned long long *,const unsigned char *,unsigned long long,const unsigned char *);
extern int crypto_sign_ed25519_keypair(unsigned char *,unsigned char *);
extern int crypto_sign_ed25519_publickey(unsigned char *,unsigned char *,unsigned char *);

#ifdef __cplusplus
}
#endif

#define crypto_sign_ed25519_IMPLEMENTATION "crypto_sign/ed25519/ref"
#define crypto_sign_ed25519_VERSION "-"

#endif
