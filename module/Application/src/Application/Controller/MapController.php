<?php
namespace Application\Controller;

use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;
use Zend\Db\Adapter\Adapter;
use Zend\Db\ResultSet\ResultSet;
use Application\Models\Users;
use Zend\Json\Json;
use Zend\View\Model\JsonModel;

use Zend\Cache\StorageFactory;
use Zend\Cache\Storage\Adapter\Memcached;
use Zend\Cache\Storage\StorageInterface;
use Zend\Cache\Storage\AvailableSpaceCapableInterface;
use Zend\Cache\Storage\FlushableInterface;
use Zend\Cache\Storage\TotalSpaceCapableInterface;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

class MapController extends AbstractActionController {

    public function __construct() {
        $this->cacheTime = 36000;
        $this->now = date("Y-m-d H:i:s");

        $this->gconfig = include __DIR__ . '../../../../config/google.config.php';
        $this->mconfig = include __DIR__ . '../../../../config/mail.config.php';
    }

    public function basic() {
        $view = new ViewModel();
        //Route
        $view->lang = $this->params()->fromRoute('lang', 'th');
        $view->action = $this->params()->fromRoute('action', 'index');
        $view->google_api_key = $this->gconfig['google_api_key'];
        return $view;       
    } 

    public function indexAction() {
        try
        {
            $view = $this->basic();
            return $view;
        }
        catch( Exception $e )
        {
            print_r($e);
        }
    }

    public function pokeAction() {
        $contents = '<h2>Hi! Someone send this place to you!</h2>';
        $contents .= base64_decode($this->params()->fromPost('contents'));
        $contents .= "<p>and I also sent you my git url: https://github.com/corelmax/zf3-starter-kit.git ,Thanks</p>";
        
        $mail = new PHPMailer;
        $mail->isSMTP();
        $mail->IsHTML(true);
        $mail->Host = $this->mconfig['smtp_host'];
        $mail->SMTPAuth = $this->mconfig['smtp_auth'];
        $mail->Username = $this->mconfig['smtp_user'];
        $mail->Password = $this->mconfig['smtp_pass'];
        $mail->SMTPSecure = 'tls';

        $mail->From = $this->mconfig['default_from_mail'];
        $mail->FromName = $this->mconfig['default_from_name'];
        $mail->addAddress('Tony@gpsn.co.th');
        $mail->Subject = 'This is poke! from @bigdevs';
        $mail->Body = $contents;
        if(!$mail->send()) {
            exit(1);
        }
        $view = $this->basic();
        return $view;
    }
}
