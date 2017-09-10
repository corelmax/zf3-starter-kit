# How to make it work?
## Get started
http://localhost/map/

## simply use docker
    git clone https://bitbucket.org/Tonytoons/zf3-starter-kit.git && cd zf3-starter-kit
    git fetch && git checkout bigdevs
    docker run -rm docker run -d -p 80:80 -v $(pwd):/var/www $(pwd)/public:/var/www/html php:apache
    docker run --rm --interactive --tty -v $(pwd):/app composer install
Then, it should able to access http://localhost/ with your browser. 
    
## configurations
##### /module/Application/config/mail.config.php
    ...
    'smtp_user' => 'postmaster@foo.io', //visit mailgun.com
    'smtp_pass' => 'secret',
    ...
    
#### Author 
##### Anucha Petchagun
##### email: corelmax@gmail.com
##### github: https://github.com/corelmax