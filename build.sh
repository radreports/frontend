docker build --no-cache -t anilyerramasu/ris-ui .
docker run -it --rm -p 3000:80 anilyerramasu/ris-ui /bin/bash
docker run  --rm -p 3000:80 anilyerramasu/radtel-pacs-ui
docker push anilyerramasu/ris-ui