id="11r2lJRBVCaoV7hLWgQ6Pky54mQUwEY5n"
wget --load-cookies /tmp/cookies.txt "https://docs.google.com/uc?export=download&confirm=$(wget --quiet --save-cookies /tmp/cookies.txt --keep-session-cookies --no-check-certificate 'https://docs.google.com/uc?export=download&id='$id -O- | sed -rn 's/.*confirm=([0-9A-Za-z_]+).*/\1\n/p')&id="$id -O resources.rar && rm -rf /tmp/cookies.txt
mkdir resources ; unrar x -ap -y resources.rar resources
rm resources.rar
