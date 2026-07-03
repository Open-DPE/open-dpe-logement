<?php

namespace App\Legacy\Repository;

use App\Legacy\Model\DPE;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;

final class DPERepository
{
    public final const BASE_URL = 'https://prd-x-ademe-externe-api.de-c1.eu1.cloudhub.io/api/v1/pub/dpe/{dpe}/xml';

    public function __construct(
        private readonly HttpClientInterface $client,
        private readonly ParameterBagInterface $params,
    ) {}

    public function find(string $id): ?DPE
    {
        $response = $this->client->request(
            method: 'GET',
            url: str_replace('{dpe}', $id, self::BASE_URL),
            options: [
                'headers' => [
                    'client_id' => $this->params->get('dpe_audit_api_client_id'),
                    'client_secret' => $this->params->get('dpe_audit_api_client_secret'),
                ],
            ],
        );
        dump($response->getStatusCode());
        if ($response->getStatusCode() !== 200) {
            return null;
        }
        $xml = simplexml_load_string($response->getContent());
        return DPE::from($xml);
    }
}
