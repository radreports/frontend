docker build --no-cache -t anilyerramasu/radtel-pacs-ui .
docker run -it --rm -p 3000:80 anilyerramasu/radtel-pacs-ui /bin/bash
docker run  --rm -p 3000:80 anilyerramasu/radtel-pacs-ui
docker push anilyerramasu/pacs-ui